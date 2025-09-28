import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertUser } from '../db/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Simulate granting premium access
    const premiumEndDate = new Date();
    premiumEndDate.setDate(premiumEndDate.getDate() + 30);
    
    await upsertUser({
        email,
        stripeCustomerId: `cus_${Date.now()}`, // dummy customer ID
        premiumEndDate: premiumEndDate.toISOString(),
    });

    console.log(`✅ [API/create-checkout-session] Mock premium granted for ${email} until ${premiumEndDate.toISOString()}`);

    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';
    const successUrl = `${domain}/#home?payment=success`;
    
    return res.status(200).json({ url: successUrl });

  } catch (error: any) {
    console.error("Dummy checkout error:", error);
    return res.status(500).json({ error: "Checkout failed" });
  }
}