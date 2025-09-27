import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findUser } from '../../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS Preflight handling
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email query parameter is required.' });
        }
        
        const user = await findUser(email);

        if (user && user.premiumEndDate) {
            const endDate = new Date(user.premiumEndDate);
            const isPremium = endDate > new Date();
            return res.status(200).json({ isPremium });
        }
        
        return res.status(200).json({ isPremium: false });

    } catch (error: any) {
        console.error('Check premium status error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}