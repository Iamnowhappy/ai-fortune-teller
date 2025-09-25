// This is a mock database using Vercel's temporary file system for demonstration.
// In a real application, you would use a persistent database like Vercel Postgres, KV, or an external DB.
// NOTE: Vercel's /tmp directory is not shared between serverless function invocations, 
// so this mock DB will not be consistent across different API calls in a deployed environment.
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join('/tmp', 'premium_users.json');

interface PremiumUser {
    email: string;
    stripeCustomerId: string;
    premiumEndDate: string; // ISO string
}

async function readDb(): Promise<PremiumUser[]> {
    try {
        await fs.mkdir(path.dirname(dbPath), { recursive: true });
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        // FIX: Replaced NodeJS.ErrnoException with a generic type to avoid namespace errors.
        if ((error as { code: string }).code === 'ENOENT') {
            await writeDb([]); // Create the file if it doesn't exist
            return [];
        }
        throw error;
    }
}

async function writeDb(users: PremiumUser[]): Promise<void> {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(users, null, 2), 'utf-8');
}

export async function findUser(email: string): Promise<PremiumUser | undefined> {
    const users = await readDb();
    return users.find(user => user.email === email);
}

export async function upsertUser(userData: { email: string; stripeCustomerId: string; premiumEndDate: string }): Promise<void> {
    let users = await readDb();
    const userIndex = users.findIndex(user => user.email === userData.email);
    if (userIndex > -1) {
        // Update existing user
        users[userIndex] = { ...users[userIndex], ...userData };
    } else {
        // Add new user
        users.push(userData);
    }
    await writeDb(users);
}