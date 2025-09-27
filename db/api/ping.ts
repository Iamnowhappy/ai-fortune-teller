import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Add CORS headers to allow browser testing from any origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const hasApiKey = !!process.env.API_KEY && process.env.API_KEY.length > 5;
    
    res.status(200).json({ 
        ok: true, 
        hasApiKey: hasApiKey,
        message: hasApiKey ? 'Server is operational and API Key seems to be configured.' : 'Server is operational, but the API_KEY environment variable is MISSING or invalid.'
    });
}