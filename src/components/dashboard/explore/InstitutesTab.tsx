"use client";

import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";

interface InstitutesTabProps {
    onInstituteClick: (inst: any) => void;
}

const mockInstitutes = [
    { id: 201, name: "All India Institute of Medical Sciences, New Delhi", type: "INI", authority: "MCC", state: "Delhi", university: "AIIMS", city: "Delhi", img: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80" },
    { id: 202, name: "Maulana Azad Medical College, New Delhi", type: "Govt", authority: "State", state: "Delhi", university: "DU", city: "Delhi", img: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80" },
    { id: 203, name: "Christian Medical College, Vellore", type: "Private", authority: "State", state: "Tamil Nadu", university: "TN MGR", city: "Vellore", img: "https://images.unsplash.com/photo-1581093458891-8f30864411f8?w=800&q=80" },
    { id: 204, name: "B. J. Govt. Medical College, Pune", type: "Govt", authority: "State", state: "Maharashtra", university: "MUHS", city: "Pune", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" },
    { id: 205, name: "Madras Medical College, Chennai", type: "Govt", authority: "State", state: "Tamil Nadu", university: "TN MGR", city: "Chennai", img: "https://images.unsplash.com/photo-1516575306052-b9576594d651?w=800&q=80" },
    { id: 206, name: "Kasturba Medical College, Manipal", type: "Deemed", authority: "MCC", state: "Karnataka", university: "Manipal", city: "Manipal", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" },
    { id: 207, name: "King George's Medical University, Lucknow", type: "Govt", authority: "State", state: "Uttar Pradesh", university: "KGMU", city: "Lucknow", img: "https://images.unsplash.com/photo-1596464716127-f9a8a4e04130?w=800&q=80" },
    { id: 208, name: "Institute of Medical Sciences BHU, Varanasi", type: "Central", authority: "MCC", state: "Uttar Pradesh", university: "BHU", city: "Varanasi", img: "https://images.unsplash.com/photo-1590073242678-cfea500593c2?w=800&q=80" },
    { id: 209, name: "Grant Government Medical College, Mumbai", type: "Govt", authority: "State", state: "Maharashtra", university: "MUHS", city: "Mumbai", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" },
    { id: 210, name: "Armed Forces Medical College, Pune", type: "Central", authority: "MCC", state: "Maharashtra", university: "MUHS", city: "Pune", img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80" },
    { id: 211, name: "St. John's Medical College, Bangalore", type: "Private", authority: "State", state: "Karnataka", university: "RGUHS", city: "Bangalore", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80" },
    { id: 212, name: "Bangalore Medical College, Bangalore", type: "Govt", authority: "State", state: "Karnataka", university: "RGUHS", city: "Bangalore", img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80" }
];

const ITEMS_PER_PAGE = 4;

export function InstitutesTab({ onInstituteClick }: InstitutesTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedAuthority, setSelectedAuthority] = useState("all");
    const [selectedState, setSelectedState] = useState("all");
    const [selectedUniversity, setSelectedUniversity] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset back to page 1 whenever any filter or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType, selectedAuthority, selectedState, selectedUniversity]);

    // Dynamic filtering logic
    const filteredInstitutes = mockInstitutes.filter((inst) => {
        const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              inst.city.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType === "all" || inst.type === selectedType;
        const matchesAuthority = selectedAuthority === "all" || inst.authority === selectedAuthority;
        const matchesState = selectedState === "all" || inst.state === selectedState;
        const matchesUniversity = selectedUniversity === "all" || inst.university === selectedUniversity;
        
        return matchesSearch && matchesType && matchesAuthority && matchesState && matchesUniversity;
    });

    // Pagination Calculations
    const totalItems = filteredInstitutes.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedInstitutes = filteredInstitutes.slice(startIndex, endIndex);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Search Area */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Institutes</h1>

                <div className="max-w-4xl mx-auto space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search institutes..."
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl">
                                <SelectValue placeholder="Institute Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="INI">INI</SelectItem>
                                <SelectItem value="Govt">Government</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                                <SelectItem value="Deemed">Deemed</SelectItem>
                                <SelectItem value="Central">Central</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedAuthority} onValueChange={setSelectedAuthority}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl">
                                <SelectValue placeholder="Authority / Board" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Authorities</SelectItem>
                                <SelectItem value="MCC">MCC</SelectItem>
                                <SelectItem value="State">State</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="Delhi">Delhi</SelectItem>
                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="Karnataka">Karnataka</SelectItem>
                                <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl">
                                <SelectValue placeholder="University" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Universities</SelectItem>
                                <SelectItem value="AIIMS">AIIMS</SelectItem>
                                <SelectItem value="DU">DU</SelectItem>
                                <SelectItem value="TN MGR">TN MGR</SelectItem>
                                <SelectItem value="MUHS">MUHS</SelectItem>
                                <SelectItem value="Manipal">Manipal</SelectItem>
                                <SelectItem value="KGMU">KGMU</SelectItem>
                                <SelectItem value="BHU">BHU</SelectItem>
                                <SelectItem value="RGUHS">RGUHS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-sm text-slate-500 font-medium pt-2">
                    {filteredInstitutes.length} Institutes found
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedInstitutes.length > 0 ? (
                    paginatedInstitutes.map((inst) => (
                        <div
                            key={inst.id}
                            onClick={() => onInstituteClick(inst)}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className="h-44 overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={inst.img}
                                    alt={inst.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 h-10 w-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">LOGO</span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors text-base">
                                    {inst.name}
                                </h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                                    Affiliated to {inst.university}
                                </p>

                                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                            <span className="text-xs">🏠</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Type</p>
                                            <p className="text-xs font-semibold text-slate-700 truncate">{inst.type}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                            <span className="text-xs">📍</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">City</p>
                                            <p className="text-xs font-semibold text-slate-700 truncate">{inst.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
                        No institutes found matching the criteria.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                label="Showing Institutes"
            />
        </div>
    );
}
