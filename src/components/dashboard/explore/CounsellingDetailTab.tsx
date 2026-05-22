"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, FileText, Bell, Plus, ChevronRight, BarChart2, Briefcase, Grid, FileBadge, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getDocByIdAction, getDocsAction } from "@/actions/admin-crud";

interface CounsellingDetailTabProps {
    counselling: any;
}


export function CounsellingDetailTab({ counselling }: CounsellingDetailTabProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [counsDetails, setCounsDetails] = useState<any>(null);
    const [timelines, setTimelines] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!counselling?.id) return;
            setIsLoading(true);
            try {
                // Fetch basic details
                const detailRes = await getDocByIdAction({ collection: "counsellings", id: counselling.id });
                if (detailRes.success && detailRes.data) {
                    setCounsDetails(detailRes.data);
                }

                // Fetch timelines
                const timelinesRes = await getDocsAction({
                    collection: "counselling_timelines",
                    query: { counselling_id: { equals: counselling.id } },
                    limit: 10
                });
                if (timelinesRes.success && timelinesRes.data?.docs) {
                    setTimelines(timelinesRes.data.docs);
                }

                // Fetch announcements
                const annRes = await getDocsAction({
                    collection: "counselling_announcements",
                    query: { counselling_id: { equals: counselling.id } },
                    limit: 10
                });
                if (annRes.success && annRes.data?.docs) {
                    setAnnouncements(annRes.data.docs);
                }
            } catch (err) {
                console.error("Failed to load counselling details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [counselling?.id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading counselling details...</p>
            </div>
        );
    }

    const name = counsDetails?.name || counselling.name;
    const websiteUrl = counsDetails?.website_url || counselling.websiteUrl;
    const registrationUrl = counsDetails?.registration_url || counselling.registrationUrl;
    const authority = counselling.authority || "Authority";
    const type = counselling.type || "Type";
    const stateName = typeof counsDetails?.state_id === "object" ? counsDetails?.state_id?.name : (counselling.state || "Central");

    const displayTimelines = timelines.map((t, idx) => {
        const d = new Date(t.event_date);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: "",
            title: t.title,
            // Simple status mocking logic based on index
            status: idx === timelines.length - 1 ? "upcoming" : (idx === timelines.length - 2 ? "active" : "completed") 
        };
    });

    const displayAnnouncements = announcements.map(a => {
        const d = new Date(a.announcement_date || new Date());
        return {
            day: d.getDate().toString(),
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            title: a.topic,
            desc: a.description || a.topic,
            tag: a.link_tag || "Link",
            link: a.link || "#"
        };
    });

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-300">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-blue-50 to-[#f8fafc] border-b border-blue-100/50 pb-8 pt-6 px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Back Button */}
                    <div className="flex items-center">
                        <Button 
                            onClick={() => router.push("/dashboard/counsellings")}
                            variant="ghost" 
                            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-xl flex items-center gap-2 h-9 px-3 -ml-3 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 text-blue-600" />
                            Back to Counsellings
                        </Button>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-slate-500 mb-6">
                        <span>Counsellings</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-slate-900">{name}</span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
                                {name}
                                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-full rotate-12 shadow-sm">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                </span>
                            </h1>
                            <p className="text-slate-600 font-medium">{stateName} • {type}</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg border-2 border-transparent"
                                onClick={() => websiteUrl && window.open(websiteUrl, '_blank')}
                                disabled={!websiteUrl}
                            >
                                <Globe className="mr-2 h-4 w-4" /> Website
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                                <Briefcase className="mr-2 h-4 w-4" /> Quotas
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm"
                                onClick={() => registrationUrl && window.open(registrationUrl, '_blank')}
                                disabled={!registrationUrl}
                            >
                                <FileText className="mr-2 h-4 w-4" /> Registration
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                                <FileBadge className="mr-2 h-4 w-4" /> Prospectus
                            </Button>
                            <Button size="sm" variant="ghost" className="bg-white/50 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200">
                                <Bell className="mr-2 h-4 w-4" /> Announcements & Events
                                <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="max-w-7xl mx-auto p-8 space-y-10">

                    {/* Insights Grid (Hardcoded per user request) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Allotments", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                            { title: "Closing Ranks", icon: BarChart2, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { title: "Seat Matrix", icon: Grid, color: "text-purple-600", bg: "bg-purple-50" },
                            { title: "Fee, Stipend & Bond", icon: FileText, color: "text-pink-600", bg: "bg-pink-50" },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-2xl p-1 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="p-5 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold text-slate-900">{item.title}</span>
                                </div>
                                <div className="bg-slate-50 px-5 py-2 rounded-xl text-[10px] text-slate-500 font-medium border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                                    <span>2023, 2024, 2025</span>
                                    <ChevronRight className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6">Counselling Timeline</h3>
                            <div className="relative pt-6 pb-2">
                                {/* Line */}
                                <div className="absolute top-9 left-0 right-0 h-0.5 bg-slate-100" />

                                <div className="flex justify-between relative z-10 overflow-x-auto pb-4 hide-scrollbar">
                                    {displayTimelines.length > 0 ? displayTimelines.map((event, i) => (
                                        <div key={i} className="flex flex-col items-center text-center min-w-[150px] max-w-[180px] px-2">
                                            <div className={`h-6 w-6 rounded-full border-4 ${event.status === 'completed' ? 'bg-green-500 border-green-100' : event.status === 'active' ? 'bg-green-500 border-green-100 ring-4 ring-green-50' : 'bg-slate-200 border-white'} mb-3`} />
                                            <p className="text-xs text-slate-500 font-medium mb-1">{event.date}</p>
                                            <p className="text-xs font-semibold text-slate-900 leading-tight">{event.title}</p>
                                        </div>
                                    )) : (
                                        <div className="w-full text-center py-4 text-slate-400 text-sm">
                                            No timeline events available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Choice List Card (Hardcoded per user request) */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Your Choice Lists</h3>
                                    <p className="text-xs text-slate-500">0 choice lists</p>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group p-8">
                                <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 font-medium">
                                    <Plus className="h-4 w-4" /> Create Choice List
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Announcements</h3>
                            <Button variant="outline" size="sm" className="bg-blue-600 text-white border-transparent hover:bg-blue-700 hover:text-white rounded-full">View all</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayAnnouncements.length > 0 ? displayAnnouncements.map((ann, i) => (
                                <div 
                                    key={i} 
                                    className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group cursor-pointer"
                                    onClick={() => ann.link && ann.link !== "#" && window.open(ann.link, '_blank')}
                                >
                                    <div className="flex flex-col items-center justify-center h-14 w-12 bg-slate-50 rounded-lg shrink-0 border border-slate-100 group-hover:bg-white group-hover:shadow-sm">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">{ann.month}</span>
                                        <span className="text-xl font-bold text-slate-900">{ann.day}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-400 mb-1 truncate">{ann.title}</p>
                                        <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">{ann.desc}</h4>
                                        <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 hover:underline truncate">
                                            {ann.tag} <Globe className="h-3 w-3 shrink-0" />
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                                    No announcements available at the moment.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
