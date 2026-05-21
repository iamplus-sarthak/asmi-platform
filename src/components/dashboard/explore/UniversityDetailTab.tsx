"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDocsAction, getDocByIdAction } from "@/actions/admin-crud";

interface UniversityDetailTabProps {
    university: any;
    onInstituteClick: (inst: any) => void;
}

const fallbackImages = [
    "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80",
    "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80",
    "https://images.unsplash.com/photo-1581093458891-8f30864411f8?w=800&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
];

export function UniversityDetailTab({ university, onInstituteClick }: UniversityDetailTabProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    const [univDetails, setUnivDetails] = useState<any>(null);
    const [affiliatedInstitutes, setAffiliatedInstitutes] = useState<any[]>([]);

    useEffect(() => {
        const fetchUniversityData = async () => {
            if (!university?.id) return;
            setIsLoading(true);
            try {
                // Fetch university details to ensure we have full data even on deep links
                const univRes = await getDocByIdAction({ collection: "universities", id: university.id });
                if (univRes.success && univRes.data) {
                    setUnivDetails(univRes.data);
                }

                // Fetch affiliated institutes
                const instRes = await getDocsAction({ 
                    collection: "institutes", 
                    limit: 100,
                    query: { university_id: { equals: university.id } }
                });

                if (instRes.success && instRes.data?.docs) {
                    const insts = instRes.data.docs;
                    
                    // Fetch addresses for these institutes to get cities
                    const addrRes = await getDocsAction({ collection: "institute_address", limit: 250 });
                    const addresses = addrRes.success && addrRes.data?.docs ? addrRes.data.docs : [];
                    const addressMap: Record<string | number, string> = {};
                    addresses.forEach((addr: any) => {
                        const instId = typeof addr.institute_id === "object" ? addr.institute_id?.id : addr.institute_id;
                        if (instId && addr.city) {
                            addressMap[instId] = addr.city;
                        }
                    });

                    // Fetch institute types to resolve their names properly
                    const typesRes = await getDocsAction({ collection: "institute_types", limit: 50 });
                    const typesMap: Record<string | number, string> = {};
                    if (typesRes.success && typesRes.data?.docs) {
                        typesRes.data.docs.forEach((t: any) => {
                            typesMap[t.id] = t.name;
                        });
                    }

                    const mapped = insts.map((inst: any, idx: number) => {
                        const typeId = typeof inst.institute_type_id === "object" ? inst.institute_type_id?.id : inst.institute_type_id;
                        const typeName = typeof inst.institute_type_id === "object" ? inst.institute_type_id?.name : (typesMap[typeId] || "Medical College");
                        
                        const coverImageUrl = typeof inst.cover_url === "object" ? inst.cover_url?.url : inst.cover_url;
                        const logoImageUrl = typeof inst.logo_url === "object" ? inst.logo_url?.url : inst.logo_url;

                        return {
                            id: inst.id,
                            name: inst.name,
                            type: typeName,
                            city: addressMap[inst.id] || "Unknown City",
                            img: coverImageUrl || fallbackImages[idx % fallbackImages.length],
                            logo: logoImageUrl || null,
                        };
                    });
                    setAffiliatedInstitutes(mapped);
                }
            } catch (err) {
                console.error("Failed to load university details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUniversityData();
    }, [university?.id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading university details...</p>
            </div>
        );
    }

    const uTypeMap: Record<string, string> = {
        central: "Central Autonomous",
        deemed: "Deemed University",
        state_govt: "State Govt University",
        state_private: "State Private University",
    };

    const name = univDetails?.name || university.name;
    const rawType = univDetails?.university_type || university.rawType;
    const displayType = uTypeMap[rawType] || rawType || "University";
    const stateName = typeof univDetails?.state_id === "object" ? univDetails?.state_id?.name : university.state;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Back Button */}
            <div className="flex items-center">
                <Button 
                    onClick={() => router.push("/dashboard/universities")}
                    variant="ghost" 
                    className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-semibold rounded-xl flex items-center gap-2 h-9 px-3 -ml-3 transition-all"
                >
                    <ArrowLeft className="h-4 w-4 text-blue-600" />
                    Back to Universities
                </Button>
            </div>
            
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none">
                    <Building2 className="w-64 h-64" />
                </div>
                <div className="relative z-10 w-full">
                    <div className="text-sm text-slate-500 mb-2 flex items-center gap-2 font-medium">
                        Universities <ArrowRight className="h-3 w-3" /> <span className="text-blue-600 truncate">{name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{name}</h1>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                            {displayType}
                        </span>
                        {stateName && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-600 font-medium text-sm">{stateName}, India</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Institutes Grid */}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        Affiliated Institutes ({affiliatedInstitutes.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {affiliatedInstitutes.length > 0 ? (
                        affiliatedInstitutes.map((inst) => (
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
                            No affiliated institutes found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
