"use client";

import React, { useState, useEffect } from "react";
import { getDocsAction } from "@/actions/admin-crud";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CounsellingsTabProps {
    onCounsellingClick: (counselling: any) => void;
}

const ITEMS_PER_PAGE = 4;

export function CounsellingsTab({ onCounsellingClick }: CounsellingsTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedState, setSelectedState] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [counsellingsList, setCounsellingsList] = useState<any[]>([]);
    const [statesList, setStatesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCounsellingData = async () => {
            try {
                const [counsRes, stateRes] = await Promise.all([
                    getDocsAction({ collection: "counsellings", limit: 200 }),
                    getDocsAction({ collection: "states", limit: 100 }),
                ]);

                if (stateRes.success && stateRes.data?.docs) {
                    setStatesList(stateRes.data.docs);
                }

                if (counsRes.success && counsRes.data?.docs && counsRes.data.docs.length > 0) {
                    const mapped = counsRes.data.docs.map((c: any) => {
                        const typeLabel = c.state_id ? "State" : "All India";
                        const stateName = typeof c.state_id === "object" ? c.state_id?.name : c.state_id;
                        const stateId = typeof c.state_id === "object" ? c.state_id?.id : c.state_id;

                        let authLabel = "Government Quota";
                        if (c.counselling_type === "management") {
                            authLabel = "Management Quota";
                        } else if (c.counselling_type === "government_and_management") {
                            authLabel = "Government & Management Quota";
                        }

                        return {
                            id: c.id,
                            name: c.name,
                            authority: authLabel,
                            type: typeLabel,
                            state: stateName || "Central",
                            stateId: stateId,
                            websiteUrl: c.website_url,
                            registrationUrl: c.registration_url,
                        };
                    });
                    setCounsellingsList(mapped);
                }
            } catch (err) {
                console.error("Failed to load counsellings:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounsellingData();
    }, []);

    // Reset back to page 1 whenever any filter or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType, selectedState]);

    // Dynamic filtering logic
    const filteredCounsellings = counsellingsList.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.authority.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType === "all" || c.type === selectedType;
        
        const matchesState = selectedState === "all" || 
                             String(c.stateId) === selectedState || 
                             c.state === selectedState;
        
        return matchesSearch && matchesType && matchesState;
    });

    // Pagination Calculations
    const totalItems = filteredCounsellings.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCounsellings = filteredCounsellings.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded-full w-1/4 mx-auto" />
                    <div className="h-11 bg-slate-100 rounded-xl max-w-3xl mx-auto" />
                    <div className="flex gap-4 max-w-xl mx-auto">
                        <div className="h-11 bg-slate-100 rounded-xl flex-1" />
                        <div className="h-11 bg-slate-100 rounded-xl flex-1" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 flex items-center gap-5 animate-pulse">
                            <div className="h-12 w-12 bg-slate-200 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Search Area */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Counsellings</h1>

                <div className="max-w-3xl mx-auto space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search counsellings..."
                    />

                    <div className="flex gap-4 max-w-xl mx-auto">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="Counselling Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="All India">All India</SelectItem>
                                <SelectItem value="State">State Quota</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="State / Authority" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All States</SelectItem>
                                {statesList.map((state) => (
                                    <SelectItem key={state.id} value={String(state.id)}>{state.name}</SelectItem>
                                ))}
                                {statesList.length === 0 && (
                                    <>
                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">{filteredCounsellings.length} Counsellings found</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedCounsellings.length > 0 ? (
                    paginatedCounsellings.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => onCounsellingClick(c)}
                            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <span className="text-lg font-bold">
                                    {c.name.charAt(0)}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                    {c.name}
                                </h3>
                                <p className="text-sm text-slate-500 truncate">
                                    {c.authority} ({c.type})
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
                        No counsellings found matching the criteria.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                label="Showing Counsellings"
            />
        </div>
    );
}
