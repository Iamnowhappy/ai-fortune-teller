import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // FIX: Updated Stripe API version to match the required type.
  apiVersion: '2025-08-27.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS Preflight handling
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';
        const successUrl = `${domain}/#home?payment=success`;
        const cancelUrl = `${domain}/#checkout?payment=cancelled`;
        
        // In a real application, this Price ID would come from your Stripe dashboard.
        // It corresponds to the 'Premium Plan' product.
        const priceId = process.env.STRIPE_PRICE_ID; 
        if (!priceId) {
            throw new Error("Stripe Price ID is not configured on the server.");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: email,
            metadata: {
              // Pass the email to the webhook for user identification
              email: email,
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        if (!session.url) {
            throw new Error('Failed to create a checkout session.');
        }

        return res.status(200).json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe session creation error:', error);
        return res.status(500).json({ error: error.message });
    }
}