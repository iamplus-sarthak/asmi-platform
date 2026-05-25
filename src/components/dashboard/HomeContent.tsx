"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Building2, PlayCircle, BookOpen, GitMerge, Search, Trophy } from "lucide-react";
import { getDocsAction } from "@/actions/admin-crud";

export const HomeContent = () => {
    const [quickUpdates, setQuickUpdates] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await getDocsAction({ 
                    collection: "announcements", 
                    query: { status: { equals: 'published' } },
                    limit: 20 
                });
                if (res.success && res.data?.docs) {
                    const all = res.data.docs;
                    setQuickUpdates(all.filter((a: any) => a.announcement_type === 'quick').slice(0, 3));
                    setEvents(all.filter((a: any) => a.announcement_type === 'event').slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, Student!</h1>
            <p className="text-slate-500 mt-1">Here's your dashboard overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">42+</h3>
                <p className="text-sm text-slate-600 font-medium">Counsellings Available</p>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">2000+</h3>
                <p className="text-sm text-slate-600 font-medium">Institutes</p>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">150+</h3>
                <p className="text-sm text-slate-600 font-medium">Video Guides</p>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">500+</h3>
                <p className="text-sm text-slate-600 font-medium">Resources</p>
            </div>
        </div>

        {/* Quick Actions */}
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-white border-2 border-slate-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <GitMerge className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Allotment Mapping</h3>
                    <p className="text-sm text-slate-500">Find your best college options</p>
                </button>

                <button className="bg-white border-2 border-slate-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                        <Search className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Rank Scan</h3>
                    <p className="text-sm text-slate-500">Analyze your rank possibilities</p>
                </button>

                <button className="bg-white border-2 border-slate-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                    <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                        <Trophy className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Closing Ranks</h3>
                    <p className="text-sm text-slate-500">View historical cutoffs</p>
                </button>
            </div>
        </div>

        {/* Announcements & Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Updates */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Quick Updates</h2>
                    <Link href="/dashboard/announcements?tab=quick" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                    {quickUpdates.length > 0 ? quickUpdates.map((update, idx) => (
                        <div key={idx} className={`flex gap-3 p-3 rounded-lg border ${idx % 3 === 0 ? 'bg-red-50 border-red-100' : idx % 3 === 1 ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>
                            <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${idx % 3 === 0 ? 'bg-red-500' : idx % 3 === 1 ? 'bg-blue-500' : 'bg-green-500'}`} />
                            <div>
                                <h4 className="font-semibold text-slate-900 text-sm">{update.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{update.message}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-100">No new updates</div>
                    )}
                </div>
            </div>

            {/* Event Notices */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
                    <Link href="/dashboard/announcements?tab=event" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                    {events.length > 0 ? events.map((ev, idx) => {
                        const d = new Date(ev.scheduled_date || ev.createdAt);
                        const day = d.getDate();
                        const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                        return (
                            <div key={idx} className="flex gap-3 p-3 rounded-lg border border-slate-200">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${idx % 3 === 0 ? 'bg-blue-100' : idx % 3 === 1 ? 'bg-purple-100' : 'bg-green-100'}`}>
                                    <span className={`text-xs text-center font-bold ${idx % 3 === 0 ? 'text-blue-600' : idx % 3 === 1 ? 'text-purple-600' : 'text-green-600'}`}>{day}<br />{month}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{ev.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ev.message}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-100">No upcoming events</div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};
