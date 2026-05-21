"use client";

import React, { useState, useEffect } from "react";
import { Search, PlayCircle, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDocsAction } from "@/actions/admin-crud";
import { recordEngagementAction } from "@/actions/analytics";

interface VideoItem {
    id: string;
    title: string;
    description?: string;
    url: string;
    thumbnailUrl: string;
    timeAgo: string;
}
export function VideosTab() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videosList, setVideosList] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await getDocsAction({ collection: "videos", limit: 100 });
                if (res.success && res.data?.docs && res.data.docs.length > 0) {
                    const published = res.data.docs.filter((v: any) => v.is_published !== false);
                    if (published.length > 0) {
                        const mapped = published.map((v: any, idx: number) => {
                            let thumb = "";
                            if (v.thumbnail_url) {
                                if (typeof v.thumbnail_url === "object") {
                                    thumb = v.thumbnail_url?.url || "";
                                } else {
                                    thumb = v.thumbnail_url;
                                }
                            }
                            if (!thumb && v.url) {
                                const ytId = getYouTubeId(v.url);
                                if (ytId) {
                                    thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                                }
                            }
                            if (!thumb) {
                                thumb = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                            }

                            return {
                                id: String(v.id),
                                title: v.title,
                                description: v.description,
                                url: v.url,
                                thumbnailUrl: thumb,
                                timeAgo: `${idx + 1} months ago`
                            };
                        });
                        setVideosList(mapped);
                    }
                }
            } catch (err) {
                console.error("Failed to load videos from DB:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Filter videos by search query
    const filteredVideos = videosList.filter(vid => 
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vid.description && vid.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-[#f8fafc] p-6 max-w-7xl mx-auto space-y-8">
                <div className='flex items-center justify-between animate-pulse'>
                    <div className="h-8 bg-slate-200 rounded-full w-48" />
                    <div className="h-9 bg-slate-200 rounded-full w-32" />
                </div>
                <div className='bg-white p-6 rounded-3xl border border-slate-200 animate-pulse space-y-4'>
                    <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col animate-pulse">
                            <div className="aspect-video bg-slate-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-slate-200 rounded-full w-5/6" />
                                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-bold text-slate-900">Videos</h1>
                <Button variant="outline" className="rounded-full bg-white border-slate-200 hover:bg-slate-50 text-slate-700">
                    <Bookmark className="mr-2 h-4 w-4 text-slate-500" /> Saved videos
                </Button>
            </div>

            {/* Search Bar */}
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-200'>
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos by title or content..."
                        className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl text-base text-slate-800 placeholder-slate-400 focus-visible:ring-blue-500/20"
                    />
                </div>
            </div>

            {/* Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Latest Updates</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((vid) => (
                            <a
                                key={vid.id}
                                href={vid.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => recordEngagementAction("videos", vid.id, "view").catch(console.error)}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all flex flex-col"
                            >
                                <div className="aspect-video bg-slate-900 relative">
                                    {/* Thumbnail Image */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={vid.thumbnailUrl}
                                        alt={vid.title}
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <PlayCircle className="h-6 w-6 text-white" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors text-sm">
                                        {vid.title}
                                    </h3>
                                    {vid.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                            {vid.description}
                                        </p>
                                    )}

                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
                            No videos found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
