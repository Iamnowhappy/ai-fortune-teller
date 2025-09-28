import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { upsertUser } from '../db/index';
import { Readable } from 'stream';

// FIX: Replaced 'declare var Buffer: any' with an explicit import to provide both the type and value for Buffer, resolving a TypeScript error where Buffer was used as a type.
import { Buffer } from 'buffer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // FIX: Updated Stripe API version to match the installed SDK's expected version.
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const email = session.metadata?.email || session.customer_details?.email;
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

        if (!email || !stripeCustomerId) {
            console.error('Webhook Error: Missing email or customer ID in session.', session.id);
            // Still return 200 so Stripe doesn't retry, but log the error for investigation.
            return res.status(200).json({ received: true, error: "Missing metadata" });
        }

        try {
            // Add 30 days of premium access
            const premiumEndDate = new Date();
            premiumEndDate.setDate(premiumEndDate.getDate() + 30);

            await upsertUser({
                email,
                stripeCustomerId,
                premiumEndDate: premiumEndDate.toISOString(),
            });
            console.log(`Successfully granted premium access to ${email} until ${premiumEndDate.toISOString()}`);
        } catch (dbError) {
            console.error('Database error during webhook processing:', dbError);
            // If the DB fails, we might want Stripe to retry. Return 500.
            return res.status(500).json({ error: 'Database update failed.' });
        }
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
}