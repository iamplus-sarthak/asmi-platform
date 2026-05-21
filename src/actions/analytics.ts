'use server';

import { getLocalPayload } from '@/lib/payload';

export async function trackSessionAction(sessionId: string, currentPath: string, isPing: boolean) {
    if (!sessionId) return { success: false };

    try {
        const payload = await getLocalPayload();
        
        const existingSessions = await payload.find({
            collection: 'sessions',
            where: { session_id: { equals: sessionId } },
            limit: 1,
        });

        const now = new Date();

        if (existingSessions.totalDocs > 0) {
            const session = existingSessions.docs[0];
            
            // Calculate new duration
            const startedAt = new Date(session.createdAt);
            const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
            
            // If it's not a ping, it means a route changed, so increment page views
            const pageViews = isPing ? session.page_views : (session.page_views || 0) + 1;
            
            // If page views > 1 or duration > 10s, it's not a bounce
            const isBounced = pageViews <= 1 && durationSeconds < 10;

            await payload.update({
                collection: 'sessions',
                id: session.id,
                data: {
                    duration_seconds: durationSeconds,
                    page_views: pageViews,
                    is_bounced: isBounced,
                    last_active_at: now.toISOString(),
                } as any,
            });
        } else {
            // Create new session
            await payload.create({
                collection: 'sessions',
                data: {
                    session_id: sessionId,
                    duration_seconds: 0,
                    page_views: 1,
                    is_bounced: true, // true until proven otherwise
                    last_active_at: now.toISOString(),
                } as any,
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Track Session Error:', error);
        return { success: false, error: 'Failed to track session' };
    }
}

export async function recordEngagementAction(collection: any, id: string | number, type: 'view' | 'download') {
    if (!id || !collection) return { success: false };

    try {
        const payload = await getLocalPayload();
        
        // Fetch current document to get current count
        const doc = await payload.findByID({ collection, id });
        if (!doc) return { success: false, error: 'Not found' };

        if (type === 'view') {
            const currentViews = doc.views || 0;
            await payload.update({
                collection,
                id,
                data: { views: currentViews + 1 } as any,
            });
        } else if (type === 'download') {
            const currentDownloads = doc.downloads || 0;
            await payload.update({
                collection,
                id,
                data: { downloads: currentDownloads + 1 } as any,
            });
        }

        return { success: true };
    } catch (error) {
        console.error(`Record Engagement Error [${collection}:${id}]:`, error);
        return { success: false, error: 'Failed to record engagement' };
    }
}
