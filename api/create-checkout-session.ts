import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    // ✅ Stripe 대신 더미 성공 URL
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';
    const successUrl = `${domain}/#home?payment=success`;
    // const cancelUrl = `${domain}/#checkout?payment=cancelled`;

    // 🔹 그냥 successUrl 바로 반환
    return res.status(200).json({ url: successUrl });

  } catch (error: any) {
    console.error("Dummy checkout error:", error);
    return res.status(500).json({ error: "Checkout failed" });
  }
}
