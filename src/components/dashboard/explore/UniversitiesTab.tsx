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
import { getDocsAction } from "@/actions/admin-crud";

interface UniversitiesTabProps {
    onUniversityClick: (univ: any) => void;
}

const ITEMS_PER_PAGE = 10;

export function UniversitiesTab({ onUniversityClick }: UniversitiesTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedState, setSelectedState] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    
    const [universitiesList, setUniversitiesList] = useState<any[]>([]);
    const [statesList, setStatesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [univRes, stateRes, instRes] = await Promise.all([
                    getDocsAction({ collection: "universities", limit: 250 }),
                    getDocsAction({ collection: "states", limit: 100 }),
                    getDocsAction({ collection: "institutes", limit: 500 }),
                ]);

                if (stateRes.success && stateRes.data?.docs) {
                    setStatesList(stateRes.data.docs);
                }

                if (univRes.success && univRes.data?.docs && univRes.data.docs.length > 0) {
                    const insts = instRes.success && instRes.data?.docs ? instRes.data.docs : [];
                    
                    // Count institutes per university
                    const countMap: Record<string | number, number> = {};
                    insts.forEach((inst: any) => {
                        const uniId = typeof inst.university_id === "object" ? inst.university_id?.id : inst.university_id;
                        if (uniId) {
                            countMap[uniId] = (countMap[uniId] || 0) + 1;
                        }
                    });

                    const mapped = univRes.data.docs.map((u: any) => {
                        const uTypeMap: Record<string, string> = {
                            central: "Central Autonomous",
                            deemed: "Deemed University",
                            state_govt: "State Govt University",
                            state_private: "State Private University",
                        };

                        const stateName = typeof u.state_id === "object" ? u.state_id?.name : u.state_id;
                        
                        return {
                            id: u.id,
                            name: u.name,
                            state: stateName || "Unknown State",
                            type: uTypeMap[u.university_type] || u.university_type,
                            count: countMap[u.id] || 0,
                            rawType: u.university_type,
                            rawStateId: typeof u.state_id === "object" ? u.state_id?.id : u.state_id,
                        };
                    });

                    setUniversitiesList(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch universities data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Reset back to page 1 whenever any filter or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType, selectedState]);

    // Dynamic filtering logic
    const filteredUniversities = universitiesList.filter((univ) => {
        const matchesSearch = univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              univ.state.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Match raw type value or mapped type string
        const matchesType = selectedType === "all" || 
                            univ.rawType === selectedType || 
                            univ.type === selectedType;

        // Match state ID or state name
        const matchesState = selectedState === "all" || 
                             String(univ.rawStateId) === selectedState || 
                             univ.state === selectedState;
        
        return matchesSearch && matchesType && matchesState;
    });

    // Pagination Calculations
    const totalItems = filteredUniversities.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded-full w-1/3 mx-auto" />
                    <div className="h-11 bg-slate-100 rounded-xl max-w-2xl mx-auto" />
                    <div className="flex gap-4 max-w-2xl mx-auto">
                        <div className="h-11 bg-slate-100 rounded-xl flex-1" />
                        <div className="h-11 bg-slate-100 rounded-xl flex-1" />
                    </div>
                </div>
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-6 animate-pulse">
                            <div className="h-12 w-12 bg-slate-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                            </div>
                            <div className="h-6 w-20 bg-slate-100 rounded-full hidden md:block" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

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
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="University Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="central">Central Autonomous</SelectItem>
                                <SelectItem value="deemed">Deemed University</SelectItem>
                                <SelectItem value="state_govt">State Govt University</SelectItem>
                                <SelectItem value="state_private">State Private University</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All States</SelectItem>
                                {statesList.map((state) => (
                                    <SelectItem key={state.id} value={String(state.id)}>
                                        {state.name}
                                    </SelectItem>
                                ))}
                                {/* Fallback states just in case */}
                                {statesList.length === 0 && (
                                    <>
                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                                    </>
                                )}
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
