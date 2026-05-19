'use server';

import { getLocalPayload } from '@/lib/payload';

export async function testDbConnectionAction() {
    try {
        const payload = await getLocalPayload();
        
        // Count users to verify connection
        const users = await payload.find({
            collection: 'users',
            limit: 1,
        });

        return { success: true, totalDocs: users.totalDocs };
    } catch (error) {
        console.error('Test DB Connection Error:', error);
        return { error: 'Failed to connect to database' };
    }
}
