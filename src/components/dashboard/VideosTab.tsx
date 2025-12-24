"use client";

import React from "react";
import { Search, PlayCircle, Clock, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function VideosTab() {
    const categories = [
        "Certificates", "Registration", "Application", "Tamilnadu", "Closing Ranks",
        "Reservation", "NRI", "Documents", "Malayalam", "Live", "Choice Filling"
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-bold text-slate-900">Videos</h1>
                <Button variant="outline" className="rounded-full">
                    <Bookmark className="mr-2 h-4 w-4" /> Saved videos
                </Button>
            </div>

            {/* Search & Filters */}
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-200'>
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search Video..."
                        className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl text-base"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                        <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg text-slate-900 font-semibold h-9 px-6">2025</Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 font-medium h-9 px-6 hover:bg-white/50">2024</Button>
                    </div>

                    <Select>
                        <SelectTrigger className="w-[200px] h-11 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="Select Counselling" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Counsellings</SelectItem></SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[180px] h-11 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="All Languages" /></SelectTrigger>
                        <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">Hindi</SelectItem></SelectContent>
                    </Select>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    <Button size="sm" variant="ghost" className="h-8 rounded-full bg-slate-900 text-white hover:bg-slate-800">
                        <span className="mr-1">#</span> All
                    </Button>
                    {categories.map(cat => (
                        <Button key={cat} size="sm" variant="ghost" className="h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/50">
                            <span className="mr-1 text-slate-400">#</span> {cat.toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Latest Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Latest</h2>
                    <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">View more &gt;</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                            <div className="aspect-video bg-slate-900 relative">
                                {/* Placeholder Thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold opacity-50">THUMBNAIL</span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    10:24
                                </div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <PlayCircle className="h-6 w-6 text-white" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                    All India Counselling | Complete Info Guide | NEET UG — 2025 | Tamil
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>5 months ago</span>
                                    <span>•</span>
                                    <span>Tamil</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
