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
import { getDocsAction } from "@/actions/admin-crud";

interface InstitutesTabProps {
    onInstituteClick: (inst: any) => void;
}


const ITEMS_PER_PAGE = 4;

const fallbackImages = [
    "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80",
    "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80",
    "https://images.unsplash.com/photo-1581093458891-8f30864411f8?w=800&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
];

export function InstitutesTab({ onInstituteClick }: InstitutesTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedAuthority, setSelectedAuthority] = useState("all");
    const [selectedState, setSelectedState] = useState("all");
    const [selectedUniversity, setSelectedUniversity] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [institutesList, setInstitutesList] = useState<any[]>([]);
    const [statesList, setStatesList] = useState<any[]>([]);
    const [universitiesList, setUniversitiesList] = useState<any[]>([]);
    const [typesList, setTypesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [instRes, stateRes, uniRes, typeRes, addrRes] = await Promise.all([
                    getDocsAction({ collection: "institutes", limit: 250 }),
                    getDocsAction({ collection: "states", limit: 100 }),
                    getDocsAction({ collection: "universities", limit: 100 }),
                    getDocsAction({ collection: "institute_types", limit: 50 }),
                    getDocsAction({ collection: "institute_address", limit: 250 }),
                ]);

                if (stateRes.success && stateRes.data?.docs) setStatesList(stateRes.data.docs);
                if (uniRes.success && uniRes.data?.docs) setUniversitiesList(uniRes.data.docs);
                if (typeRes.success && typeRes.data?.docs) setTypesList(typeRes.data.docs);

                if (instRes.success && instRes.data?.docs && instRes.data.docs.length > 0) {
                    const addresses = addrRes.success && addrRes.data?.docs ? addrRes.data.docs : [];
                    const addressMap: Record<string | number, string> = {};
                    addresses.forEach((addr: any) => {
                        const instId = typeof addr.institute_id === "object" ? addr.institute_id?.id : addr.institute_id;
                        if (instId && addr.city) {
                            addressMap[instId] = addr.city;
                        }
                    });

                    const mapped = instRes.data.docs.map((inst: any, idx: number) => {
                        const typeName = typeof inst.institute_type_id === "object" ? inst.institute_type_id?.name : inst.institute_type_id;
                        const typeId = typeof inst.institute_type_id === "object" ? inst.institute_type_id?.id : inst.institute_type_id;
                        const stateName = typeof inst.state_id === "object" ? inst.state_id?.name : inst.state_id;
                        const stateId = typeof inst.state_id === "object" ? inst.state_id?.id : inst.state_id;
                        const uniName = typeof inst.university_id === "object" ? inst.university_id?.name : inst.university_id;
                        const uniId = typeof inst.university_id === "object" ? inst.university_id?.id : inst.university_id;
                        const authLabel = inst.authority_type === "central" ? "MCC" : "State";
                        
                        const coverImageUrl = typeof inst.cover_url === "object" ? inst.cover_url?.url : inst.cover_url;
                        const logoImageUrl = typeof inst.logo_url === "object" ? inst.logo_url?.url : inst.logo_url;

                        return {
                            id: inst.id,
                            name: inst.name,
                            type: typeName || "Unknown Type",
                            typeId: typeId,
                            authority: authLabel,
                            rawAuthority: inst.authority_type,
                            state: stateName || "Unknown State",
                            stateId: stateId,
                            university: uniName || "Unknown University",
                            universityId: uniId,
                            city: addressMap[inst.id] || stateName || "Unknown City",
                            img: coverImageUrl || fallbackImages[idx % fallbackImages.length],
                            logo: logoImageUrl || null,
                        };
                    });

                    setInstitutesList(mapped);
                }
            } catch (err) {
                console.error("Failed to load institutes and relations:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Reset back to page 1 whenever any filter or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType, selectedAuthority, selectedState, selectedUniversity]);

    // Dynamic filtering logic
    const filteredInstitutes = institutesList.filter((inst) => {
        const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              inst.city.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType === "all" || 
                            String(inst.typeId) === selectedType || 
                            inst.type === selectedType;

        const matchesAuthority = selectedAuthority === "all" || 
                                 inst.rawAuthority === selectedAuthority || 
                                 inst.authority === selectedAuthority;

        const matchesState = selectedState === "all" || 
                             String(inst.stateId) === selectedState || 
                             inst.state === selectedState;

        const matchesUniversity = selectedUniversity === "all" || 
                                  String(inst.universityId) === selectedUniversity || 
                                  inst.university === selectedUniversity;
        
        return matchesSearch && matchesType && matchesAuthority && matchesState && matchesUniversity;
    });

    // Pagination Calculations
    const totalItems = filteredInstitutes.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedInstitutes = filteredInstitutes.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded-full w-1/4 mx-auto" />
                    <div className="h-11 bg-slate-100 rounded-xl max-w-4xl mx-auto" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="h-10 bg-slate-100 rounded-xl" />
                        <div className="h-10 bg-slate-100 rounded-xl" />
                        <div className="h-10 bg-slate-100 rounded-xl" />
                        <div className="h-10 bg-slate-100 rounded-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
                            <div className="h-44 bg-slate-200" />
                            <div className="p-5 flex-1 space-y-3">
                                <div className="h-5 bg-slate-200 rounded-full w-5/6" />
                                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <div className="h-10 bg-slate-50 rounded-xl" />
                                    <div className="h-10 bg-slate-50 rounded-xl" />
                                </div>
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
                <h1 className="text-3xl font-bold text-slate-900">Institutes</h1>

                <div className="max-w-4xl mx-auto space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search institutes..."
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-slate-700">
                                <SelectValue placeholder="Institute Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Types</SelectItem>
                                {typesList.map((type) => (
                                    <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                                ))}
                                {typesList.length === 0 && (
                                    <>
                                        <SelectItem value="INI">INI</SelectItem>
                                        <SelectItem value="Govt">Government</SelectItem>
                                        <SelectItem value="Private">Private</SelectItem>
                                        <SelectItem value="Deemed">Deemed</SelectItem>
                                        <SelectItem value="Central">Central</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>

                        <Select value={selectedAuthority} onValueChange={setSelectedAuthority}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-slate-700">
                                <SelectValue placeholder="Authority / Board" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Authorities</SelectItem>
                                <SelectItem value="central">MCC (Central)</SelectItem>
                                <SelectItem value="state">State Board</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-slate-700">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All States</SelectItem>
                                {statesList.map((state) => (
                                    <SelectItem key={state.id} value={String(state.id)}>{state.name}</SelectItem>
                                ))}
                                {statesList.length === 0 && (
                                    <>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>

                        <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-slate-700">
                                <SelectValue placeholder="University" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Universities</SelectItem>
                                {universitiesList.map((uni) => (
                                    <SelectItem key={uni.id} value={String(uni.id)}>{uni.name}</SelectItem>
                                ))}
                                {universitiesList.length === 0 && (
                                    <>
                                        <SelectItem value="AIIMS">AIIMS</SelectItem>
                                        <SelectItem value="DU">DU</SelectItem>
                                        <SelectItem value="TN MGR">TN MGR</SelectItem>
                                        <SelectItem value="MUHS">MUHS</SelectItem>
                                    </>
                                )}
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
                            <div className="h-44 overflow-hidden relative bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={inst.img}
                                    alt={inst.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 h-10 w-10 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                                    {inst.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={inst.logo} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">LOGO</span>
                                    )}
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
