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
import { CounsellingSelector } from "./CounsellingSelector";

interface InsightsTableLayoutProps {
    title: string;
    columns: string[];
    children: React.ReactNode;
    counsellingName?: string;
}

export function InsightsTableLayout({ title, columns, children, counsellingName = "All India UG - Medical & Dental" }: InsightsTableLayoutProps) {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedCounselling, setSelectedCounselling] = useState(counsellingName);
    
    // Self-contained Search & Select Round filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRound, setSelectedRound] = useState("All");

    // Dynamically fetch all unique ROUND options from children's data
    const roundOptions = ["All", ...Array.from(new Set(
        React.Children.toArray(children)
            .map(child => {
                if (React.isValidElement(child)) {
                    const props = child.props as any;
                    if (props && props.data) {
                        return props.data[0];
                    }
                }
                return null;
            })
            .filter(Boolean)
    ))];

    // Filter children React elements dynamically
    const filteredChildren = React.Children.toArray(children).filter((child) => {
        if (!React.isValidElement(child)) return true;
        
        const props = child.props as any;
        if (!props || !props.data) return true;
        
        const rowData: any[] = props.data;
        
        // Search matches any cell in the row
        const matchesSearch = searchQuery === "" || rowData.some(cell => 
            cell !== null && cell !== undefined && cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Round matches cell at index 0
        const matchesRound = selectedRound === "All" || rowData[0] === selectedRound;
        
        return matchesSearch && matchesRound;
    });

    const handleCounsellingSelect = (name: string) => {
        setSelectedCounselling(name);
        setIsSelectorOpen(false);
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] w-full">
            {isSelectorOpen && (
                <CounsellingSelector
                    title={title}
                    onSelect={handleCounsellingSelect}
                    onClose={() => setIsSelectorOpen(false)}
                />
            )}

            <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6 flex-1 flex flex-col">
                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                            <span className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-blue-600">What&apos;s this?</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSelectorOpen(true)}
                                className="h-10 px-4 bg-white border border-red-200 text-red-500 font-medium rounded-full flex items-center gap-2 hover:bg-red-50 transition-colors shadow-sm"
                            >
                                {selectedCounselling}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <Button variant="outline" className="h-10 rounded-full text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600">
                                Go to counselling <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between text-sm text-blue-800">
                        <span className="flex items-center gap-2">
                            <span className="bg-blue-100 p-1 rounded-full"><Lock className="h-3 w-3" /></span>
                            Read this before looking at the {title}
                        </span>
                        <div className="flex items-center gap-4 text-xs font-semibold cursor-pointer">
                            <span className="hover:underline">Spotted an error? Let us know</span>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-900">
                                {filteredChildren.length > 0 ? `1 - ${filteredChildren.length}` : "0"}
                            </span> of <span className="font-semibold text-slate-900">
                                {React.Children.count(children)}
                            </span> Records in 2025 session
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-[280px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search" 
                                    className="pl-9 h-9 bg-white border-slate-200 rounded-lg text-sm" 
                                />
                            </div>

                            <Select value={selectedRound} onValueChange={setSelectedRound}>
                                <SelectTrigger className="h-9 w-[130px] bg-white border-slate-200 text-slate-600 rounded-lg">
                                    <SelectValue placeholder="Select Round" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roundOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt === "All" ? "All Rounds" : `Round ${opt}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 rounded-lg">
                                <ArrowUpFromLine className="mr-2 h-3 w-3" /> Sort
                            </Button>

                            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 rounded-lg">
                                <Filter className="mr-2 h-3 w-3" /> Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
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
                                {filteredChildren.length > 0 ? (
                                    filteredChildren
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 font-medium bg-white">
                                            No records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Content Locked Overlay */}
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

export const TableRow = ({ data }: { data: any[] }) => (
    <tr className="hover:bg-slate-50 transition-colors group">
        {data.map((cell, i) => (
            <td key={i} className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap group-hover:text-blue-700">
                {cell}
            </td>
        ))}
    </tr>
);
