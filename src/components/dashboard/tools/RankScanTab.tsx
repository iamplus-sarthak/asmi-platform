"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Lock, ChevronRight, Filter, ArrowUpFromLine, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RankScanFilter } from "./RankScanFilter";
import { TableRow } from "../insights/InsightsTableLayout";

export function RankScanTab() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Based on the "Allotments" style but for "Rank Scan"
    const columns = [
        "ROUND", "AI RANK", "STATE", "INSTITUTE", "COURSE", "QUOTA", "CATEGORY", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY"
    ];

    const data = [
        ["1", "1", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
        ["1", "2", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
        ["1", "3", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] w-full min-h-[calc(100vh-4rem)]">
            {isFilterOpen && (
                <RankScanFilter onClose={() => setIsFilterOpen(false)} onApply={() => setIsFilterOpen(false)} />
            )}

            <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-slate-900">Rank Scan</h1>
                        <span className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-blue-600">What&apos;s this?</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between text-sm text-blue-800">
                        <span className="flex items-center gap-2">
                            <span className="bg-blue-100 p-1 rounded-full"><Lock className="h-3 w-3" /></span>
                            Read this before looking at the Rank Scan
                        </span>
                        <div className="flex items-center gap-4 text-xs font-semibold cursor-pointer">
                            <span className="hover:underline">Spotted an error? Let us know</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-900">1 - 3</span> of <span className="font-semibold text-slate-900">400980</span> Records in 2025 session
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-[280px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search" className="pl-9 h-9 bg-white border-slate-200 rounded-lg text-sm" />
                            </div>

                            <Select>
                                <SelectTrigger className="h-9 w-[130px] bg-white border-slate-200 text-slate-600 rounded-lg"><SelectValue placeholder="Select filter" /></SelectTrigger>
                                <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 rounded-lg">
                                <ArrowUpFromLine className="mr-2 h-3 w-3" /> Sort
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFilterOpen(true)}
                                className="h-9 border-slate-200 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600"
                            >
                                <Filter className="mr-2 h-3 w-3" /> Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                                <tr>
                                    {columns.map((col, i) => (
                                        <th key={i} className="px-6 py-4 border-b border-slate-100 whitespace-nowrap bg-slate-50">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((row, i) => (
                                    <TableRow key={i} data={row} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Content Locked Overlay (Reusing design) */}
                    <div className="bg-gradient-to-t from-slate-50 to-white/50 border-t border-slate-100 p-12 flex flex-col items-center justify-center text-center gap-4 relative z-20">
                        <div className="h-14 w-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-2">
                            <Lock className="h-6 w-6 text-slate-900" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Content Locked</h3>
                            <p className="text-slate-500">Please purchase a NEET UG package to view more</p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 h-auto rounded-xl shadow-lg shadow-blue-600/20 mt-2">
                            View Packages <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
