"use client";

import React from "react";
import { Globe, FileText, Bell, Plus, ChevronRight, BarChart2, Briefcase, Grid, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CounsellingDetailTabProps {
    counselling: any;
}

export function CounsellingDetailTab({ counselling }: CounsellingDetailTabProps) {
    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-blue-50 to-[#f8fafc] border-b border-blue-100/50 pb-8 pt-8 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start gap-2 text-sm text-slate-500 mb-6">
                        <span>Counsellings</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-slate-900">{counselling.name}</span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
                                {counselling.name}
                                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-full rotate-12 shadow-sm">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                </span>
                            </h1>
                            <p className="text-slate-600 font-medium">Central • All India</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg border-2 border-transparent">
                                <Globe className="mr-2 h-4 w-4" /> Website
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                                <Briefcase className="mr-2 h-4 w-4" /> Quotas
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm">
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

                    {/* Insights Grid */}
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

                                <div className="flex justify-between relative z-10">
                                    {[
                                        { date: "Dec 21, 2025", time: "12:00 PM", title: "Special Stray Vacancy Round Choice Locking Ends", status: "completed" },
                                        { date: "Dec 21, 2025", time: "12:00 PM", title: "Special Stray Vacancy Round Choice Filling Ends", status: "active" },
                                        { date: "Dec 23, 2025", time: "", title: "Special Stray Vacancy Round Result", status: "upcoming" },
                                    ].map((event, i) => (
                                        <div key={i} className="flex flex-col items-center text-center max-w-[180px]">
                                            <div className={`h-6 w-6 rounded-full border-4 ${event.status === 'completed' ? 'bg-green-500 border-green-100' : event.status === 'active' ? 'bg-green-500 border-green-100 ring-4 ring-green-50' : 'bg-slate-200 border-white'} mb-3`} />
                                            <p className="text-xs text-slate-500 font-medium mb-1">{event.date}</p>
                                            <p className="text-xs font-semibold text-slate-900 leading-tight">{event.title}</p>
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 hover:bg-slate-200 cursor-pointer">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Choice List Card */}
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
                            {[
                                { day: "19", month: "DEC", title: "Withdrawal of Seats", desc: "Withdrawal of seats in Special Stray Round", tag: "Withdrawal Seats" },
                                { day: "18", month: "DEC", title: "Seat Matrix", desc: "Revised Special Stray Vacancy Round MBBS Seat Matrix", tag: "Seat Matrix" },
                                { day: "17", month: "DEC", title: "Schedule", desc: "Schedule for Special Stray Vacancy & 5th Round", tag: "Schedule" },
                            ].map((ann, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
                                    <div className="flex flex-col items-center justify-center h-14 w-12 bg-slate-50 rounded-lg shrink-0 border border-slate-100 group-hover:bg-white group-hover:shadow-sm">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">{ann.month}</span>
                                        <span className="text-xl font-bold text-slate-900">{ann.day}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 mb-1">{ann.title}</p>
                                        <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2">{ann.desc}</h4>
                                        <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                                            {ann.tag} <Globe className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
