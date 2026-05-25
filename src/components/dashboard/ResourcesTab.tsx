"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, FileText, Download, ExternalLink, Image as ImageIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDocsAction } from "@/actions/admin-crud";

interface ResourceItem {
    id: string;
    title: string;
    description?: string;
    resourceType: "pdf" | "image" | "link" | "other";
    fileUrl?: string;
    externalUrl?: string;
}

export function ResourcesTab() {
    const [activeType, setActiveType] = useState<string>("pdf");
    const [resourcesList, setResourcesList] = useState<ResourceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { key: "pdf", label: "PDF Documents", icon: FileText, color: "text-red-500 border-red-100 bg-red-50" },
        { key: "image", label: "Image Sheets", icon: ImageIcon, color: "text-emerald-500 border-emerald-100 bg-emerald-50" },
        { key: "link", label: "External Links", icon: ExternalLink, color: "text-blue-500 border-blue-100 bg-blue-50" },
        { key: "other", label: "Other Materials", icon: HelpCircle, color: "text-amber-500 border-amber-100 bg-amber-50" },
    ];

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await getDocsAction({ collection: "resources", limit: 200 });
                if (res.success && res.data?.docs && res.data.docs.length > 0) {
                    const published = res.data.docs.filter((r: any) => r.is_published !== false);
                    if (published.length > 0) {
                        const mapped = published.map((r: any) => {
                            const fileUrl = typeof r.file === "object" ? r.file?.url : undefined;
                            return {
                                id: String(r.id),
                                title: r.title,
                                description: r.description,
                                resourceType: r.resource_type,
                                fileUrl: fileUrl,
                                externalUrl: r.external_url,
                            };
                        });
                        setResourcesList(mapped);
                    } else {
                        setResourcesList([]);
                    }
                } else {
                    setResourcesList([]);
                }
            } catch (err) {
                console.error("Failed to fetch resources from DB:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Filter resources by currently selected category type
    const filteredResources = resourcesList.filter(item => item.resourceType === activeType);

    if (isLoading) {
        return (
            <div className="flex flex-col h-full p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded-full w-48" />
                </div>
                <div className="flex gap-8 h-[calc(100vh-12rem)]">
                    <div className="w-[300px] bg-white rounded-2xl border border-slate-200 p-4 h-full animate-pulse space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                        ))}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 h-full animate-pulse space-y-4">
                        <div className="h-6 bg-slate-200 rounded-full w-40" />
                        <div className="space-y-3 pt-6">
                            <div className="h-16 bg-slate-100 rounded-xl w-full" />
                            <div className="h-16 bg-slate-100 rounded-xl w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const activeCatInfo = categories.find(c => c.key === activeType) || categories[0];

    return (
        <div className="flex flex-col h-full p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
            </div>

            {/* Main Area */}
            <div className="flex gap-8 h-[calc(100vh-16rem)] min-h-[500px]">
                {/* Sidebar Navigation */}
                <div className="w-[300px] shrink-0 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-full">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        Categories
                    </div>
                    <div className="space-y-2">
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveType(cat.key)}
                                    className={cn(
                                        "w-full text-left p-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group border border-transparent",
                                        activeType === cat.key
                                            ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <IconComponent className={cn("h-4 w-4 shrink-0", activeType === cat.key ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                        {cat.label}
                                    </span>
                                    <ChevronRight className={cn("h-4 w-4 opacity-0 transition-opacity", activeType === cat.key && "opacity-100 text-blue-600")} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full overflow-hidden flex flex-col">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", activeCatInfo.color)}>
                            {activeCatInfo.label}
                        </span>
                    </div>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6">
                            {filteredResources.length > 0 ? (
                                filteredResources.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 bg-slate-50 border border-slate-200/60 hover:border-slate-300 rounded-2xl hover:bg-slate-100/50 transition-all flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    >
                                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                                            {activeType === "pdf" && <FileText className="h-5 w-5 text-red-500" />}
                                            {activeType === "image" && <ImageIcon className="h-5 w-5 text-emerald-500" />}
                                            {activeType === "link" && <ExternalLink className="h-5 w-5 text-blue-500" />}
                                            {activeType === "other" && <HelpCircle className="h-5 w-5 text-amber-500" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">
                                                {item.title}
                                            </h3>
                                            {item.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                                    {item.description}
                                                </p>
                                            )}

                                            {/* Action Button */}
                                            {item.resourceType === "link" && item.externalUrl && (
                                                <a
                                                    href={item.externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            )}

                                            {item.resourceType !== "link" && item.fileUrl && (
                                                <a
                                                    href={item.fileUrl}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                                                >
                                                    Download Resource <Download className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-2xl">
                                    No {activeCatInfo.label.toLowerCase()} available.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
