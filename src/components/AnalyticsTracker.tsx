'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackSessionAction } from '@/actions/analytics';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Initialize session ID if it doesn't exist
        if (!sessionIdRef.current) {
            let sid = sessionStorage.getItem('asmi_session_id');
            if (!sid) {
                sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                sessionStorage.setItem('asmi_session_id', sid);
            }
            sessionIdRef.current = sid;
        }

        const sid = sessionIdRef.current;

        // Track route change
        trackSessionAction(sid, pathname || '/', false).catch(console.error);

        // Ping every 10 seconds to update duration
        const interval = setInterval(() => {
            trackSessionAction(sid, pathname || '/', true).catch(console.error);
        }, 10000);

        return () => clearInterval(interval);
    }, [pathname]);

    return null; // Invisible component
}
