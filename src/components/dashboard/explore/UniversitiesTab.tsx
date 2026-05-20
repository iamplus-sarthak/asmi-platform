"use client";

import React, { useState, useEffect } from "react";
import { Building2, MapPin } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";

interface UniversitiesTabProps {
    onUniversityClick: (univ: any) => void;
}

const mockUniversities = [
    { id: 1, name: "Maharashtra University of Health Sciences, Nashik", state: "Maharashtra", type: "State Govt University", count: 98 },
    { id: 2, name: "Rajiv Gandhi University of Health Sciences", state: "Karnataka", type: "State Govt University", count: 145 },
    { id: 3, name: "All India Institute of Medical Sciences (AIIMS)", state: "Delhi", type: "Central Autonomous", count: 20 },
    { id: 4, name: "Dr. M.G.R. Medical University", state: "Tamil Nadu", type: "State Govt University", count: 112 },
    { id: 5, name: "Gujarat University", state: "Gujarat", type: "State Govt University", count: 45 },
    { id: 6, name: "NTR University of Health Sciences", state: "Andhra Pradesh", type: "State Govt University", count: 80 },
    { id: 7, name: "Kaloji Narayana Rao University of Health Sciences", state: "Telangana", type: "State Govt University", count: 65 },
    { id: 8, name: "King George's Medical University", state: "Uttar Pradesh", type: "State Govt University", count: 70 },
    { id: 9, name: "West Bengal University of Health Sciences", state: "West Bengal", type: "State Govt University", count: 85 },
    { id: 10, name: "Baba Farid University of Health Sciences", state: "Punjab", type: "State Govt University", count: 50 },
    { id: 11, name: "Banaras Hindu University (BHU)", state: "Uttar Pradesh", type: "Central Autonomous", count: 15 },
    { id: 12, name: "JIPMER", state: "Puducherry", type: "Central Autonomous", count: 12 }
];

const ITEMS_PER_PAGE = 3; // Standard batch size to demonstrate pagination

export function UniversitiesTab({ onUniversityClick }: UniversitiesTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedState, setSelectedState] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset back to page 1 whenever any filter or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType, selectedState]);

    // Dynamic filtering logic
    const filteredUniversities = mockUniversities.filter((univ) => {
        const matchesSearch = univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              univ.state.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType === "all" || univ.type === selectedType;
        const matchesState = selectedState === "all" || univ.state === selectedState;
        
        return matchesSearch && matchesType && matchesState;
    });

    // Pagination Calculations
    const totalItems = filteredUniversities.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Explore Universities</h1>

                <div className="max-w-2xl mx-auto space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search universities..."
                    />

                    <div className="flex gap-4">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1">
                                <SelectValue placeholder="University Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="State Govt University">State Govt University</SelectItem>
                                <SelectItem value="Central Autonomous">Central Autonomous</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="Karnataka">Karnataka</SelectItem>
                                <SelectItem value="Delhi">Delhi</SelectItem>
                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="Gujarat">Gujarat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="text-sm text-slate-500 font-medium">{filteredUniversities.length} Universities found</p>
            </div>

            {/* List Section */}
            <div className="grid gap-4">
                {paginatedUniversities.length > 0 ? (
                    paginatedUniversities.map((univ) => (
                        <div
                            key={univ.id}
                            onClick={() => onUniversityClick(univ)}
                            className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-6"
                        >
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <Building2 className="h-6 w-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                                    {univ.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {univ.state}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span>{univ.type}</span>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center justify-end px-4">
                                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700">
                                    {univ.count} Institutes
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 font-medium">
                        No universities found matching your search.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                label="Showing Universities"
            />
        </div>
    );
}
