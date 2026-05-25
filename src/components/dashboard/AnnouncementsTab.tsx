"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getDocsAction } from "@/actions/admin-crud";
import { Bell, Clock, Globe } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnnouncementItem {
    id: string;
    title: string;
    message: string;
    type: string;
    target: string;
    date: string;
}

export function AnnouncementsTab() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") || "all";
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await getDocsAction({ 
                    collection: "announcements", 
                    query: { status: { equals: 'published' } },
                    limit: 50 
                });
                if (res.success && res.data?.docs) {
                    const mapped = res.data.docs.map((a: any) => ({
                        id: String(a.id),
                        title: a.title,
                        message: a.message,
                        type: a.announcement_type || "general",
                        target: a.target_audience || "all",
                        date: new Date(a.createdAt).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                    }));
                    setAnnouncements(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch announcements", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case "quick": return "bg-red-50 border-red-100 text-red-700";
            case "event": return "bg-blue-50 border-blue-100 text-blue-700";
            default: return "bg-green-50 border-green-100 text-green-700";
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "quick": return "bg-red-500";
            case "event": return "bg-blue-500";
            default: return "bg-green-500";
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.replace(`/dashboard/announcements?tab=${tab}`);
    };

    const filteredAnnouncements = announcements.filter(a => {
        if (activeTab === "all") return true;
        if (activeTab === "quick" && a.type === "quick") return true;
        if (activeTab === "event" && a.type === "event") return true;
        if (activeTab === "general" && a.type === "general") return true;
        return false;
    });

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">All Announcements</h1>
                    <p className="text-slate-500 mt-1">Stay updated with the latest news and notices</p>
                </div>
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                    <Bell className="h-6 w-6 text-blue-600" />
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                    { id: "all", label: "All Updates" },
                    { id: "quick", label: "Quick Updates" },
                    { id: "event", label: "Upcoming Events" },
                    { id: "general", label: "General" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                        ))}
                    </div>
                ) : filteredAnnouncements.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAnnouncements.map((ann) => (
                            <div 
                                key={ann.id} 
                                className={`flex gap-4 p-5 rounded-xl border transition-all ${getTypeStyles(ann.type)} hover:shadow-md cursor-pointer`}
                            >
                                <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${getTypeBadgeColor(ann.type)}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg leading-tight">{ann.title}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 bg-white/60 rounded-md border border-black/5 opacity-80 shrink-0">
                                            {ann.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm opacity-80 mb-3 whitespace-pre-wrap">{ann.message}</p>
                                    <div className="flex items-center gap-4 text-xs font-semibold opacity-70">
                                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {ann.date}</span>
                                        <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> For: {ann.target.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                        <Bell className="h-12 w-12 text-slate-200 mb-4" />
                        <h3 className="font-bold text-lg text-slate-500">No announcements yet</h3>
                        <p className="text-sm">Check back later for updates</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
