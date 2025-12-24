"use client";

import React, { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ResourcesTab() {
    const [activeSet, setActiveSet] = useState("Info Video");

    const resourceSets = [
        "Info Video",
        "Certificates And Documents Required - 2024 & 2025",
        "2024 All Counselling Notifications",
        "Participating Institutes",
        "WhatsApp Community / Telegram Links"
    ];

    return (
        <div className="flex flex-col h-full p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
                <Select defaultValue="2025">
                    <SelectTrigger className="w-[100px] h-9 bg-white border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="2025">2025</SelectItem><SelectItem value="2024">2024</SelectItem></SelectContent>
                </Select>
            </div>

            <div className="flex gap-8 h-[calc(100vh-12rem)]">
                {/* Sidebar */}
                <div className="w-[300px] shrink-0 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-full">
                    <ScrollArea className="h-full pr-3">
                        <div className="space-y-2">
                            {resourceSets.map((set, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveSet(set)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group",
                                        activeSet === set
                                            ? "bg-red-50 text-red-600 border border-red-100"
                                            : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                    )}
                                >
                                    <span className={cn(activeSet === set ? "text-red-600" : "text-slate-600 group-hover:text-slate-900")}>
                                        Set {i + 1} - {set.split("-")[0]}
                                    </span>
                                    {activeSet === set && <ChevronRight className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full overflow-hidden flex flex-col">
                    <div className="mb-6">
                        <span className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                            {activeSet} 2025
                        </span>
                    </div>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">ZyNerd Portal Demo</h3>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-600">
                                        ZyNerd Portal Demo | Explore All Features -
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Portal Demo in Tamil</a> /
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Portal Demo in English</a>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Tamil Nadu GOVT / MNG Info Series</h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Tamil Nadu Govt Quota | Eligibility Certificate Delayed - TN Dr. MGR Medical University -
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Info Video in English</a> /
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Info Video in Tamil</a> /
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Sworn affidavit Format (Documents to be Notarized)</a>
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Tamil Nadu Govt Quota - 7.5% Preferential Quota | Bonafide Certificate - Confusions Clarified -
                                        <a href="#" className="text-blue-600 hover:underline mx-1">Info Video in English</a> /
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
