"use server";

import { getLocalPayload } from "@/lib/payload";

const STATIC_PAGES = [
    { title: "Dashboard Home", subtitle: "Main Overview", type: "page", href: "/dashboard" },
    { title: "Videos", subtitle: "Video Guides", type: "page", href: "/dashboard/videos" },
    { title: "Allotments", subtitle: "Insights", type: "page", href: "/dashboard/allotments" },
    { title: "Closing Ranks", subtitle: "Insights", type: "page", href: "/dashboard/closing-ranks" },
    { title: "Seat Matrix", subtitle: "Insights", type: "page", href: "/dashboard/seat-matrix" },
    { title: "Fee, Stipend & Bond", subtitle: "Insights", type: "page", href: "/dashboard/fee-stipend" },
    { title: "Allotment Mapping", subtitle: "Tools", type: "page", href: "/dashboard/allotment-mapping" },
    { title: "Rank Scan", subtitle: "Tools", type: "page", href: "/dashboard/rank-scan" },
    { title: "Institutes", subtitle: "Explore", type: "page", href: "/dashboard/institutes" },
    { title: "Universities", subtitle: "Explore", type: "page", href: "/dashboard/universities" },
    { title: "Counsellings", subtitle: "Explore", type: "page", href: "/dashboard/counsellings" },
    { title: "Courses", subtitle: "Explore", type: "page", href: "/dashboard/courses" },
    { title: "Resources", subtitle: "Study Material", type: "page", href: "/dashboard/resources" },
    { title: "My Profile", subtitle: "Account", type: "page", href: "/dashboard/profile" },
    { title: "Blogs & News", subtitle: "Updates", type: "page", href: "/dashboard/blogs-news" }
];

export async function globalSearchAction(query: string) {
    if (!query || query.length < 2) {
        return { success: true, data: [] };
    }

    try {
        const payload = await getLocalPayload();
        
        // Search across Institutes, Counsellings, Announcements
        const [institutesRes, counsellingsRes, announcementsRes] = await Promise.all([
            payload.find({
                collection: "institutes",
                where: {
                    name: { like: query }
                },
                limit: 5
            }),
            payload.find({
                collection: "counsellings",
                where: {
                    name: { like: query }
                },
                limit: 5
            }),
            payload.find({
                collection: "announcements",
                where: {
                    title: { like: query },
                    status: { equals: 'published' }
                },
                limit: 5
            })
        ]);

        const results: any[] = [];

        // 1. Static Pages matching query
        const qLower = query.toLowerCase();
        const matchedPages = STATIC_PAGES.filter(p => p.title.toLowerCase().includes(qLower) || p.subtitle.toLowerCase().includes(qLower));
        
        matchedPages.forEach(p => {
            results.push({
                id: p.href,
                title: p.title,
                subtitle: p.subtitle,
                type: p.type,
                href: p.href
            });
        });

        if (institutesRes.docs) {
            institutesRes.docs.forEach((doc: any) => {
                results.push({
                    id: String(doc.id),
                    title: doc.name,
                    subtitle: doc.location || doc.state || "Institute",
                    type: "institute",
                    href: `/dashboard/institutes/${doc.id}`
                });
            });
        }

        if (counsellingsRes.docs) {
            counsellingsRes.docs.forEach((doc: any) => {
                results.push({
                    id: String(doc.id),
                    title: doc.name,
                    subtitle: doc.counselling_type || "Counselling",
                    type: "counselling",
                    href: `/dashboard/counsellings/${doc.id}`
                });
            });
        }

        if (announcementsRes.docs) {
            announcementsRes.docs.forEach((doc: any) => {
                results.push({
                    id: String(doc.id),
                    title: doc.title,
                    subtitle: doc.announcement_type?.toUpperCase() || "Update",
                    type: "announcement",
                    href: `/dashboard/announcements`
                });
            });
        }

        return { success: true, data: results };
    } catch (error) {
        console.error("Global search failed:", error);
        return { success: false, error: "Search failed" };
    }
}
