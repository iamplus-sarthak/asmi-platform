"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Building2, MapPin, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UniversityDetailTabProps {
    university: any;
    onInstituteClick: (inst: any) => void;
}

const mockInstitutes = [
    { id: 101, name: "B. J. Govt. Medical College, Pune", type: "Government Institute", city: "Pune", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" },
    { id: 102, name: "Seth GS Medical College, Mumbai", type: "Government Institute", city: "Mumbai", img: "https://images.unsplash.com/photo-1592280771190-3e2e4d50c2fa?w=800&q=80" },
    { id: 103, name: "Topiwala National Medical College, Mumbai", type: "Government Institute", city: "Mumbai", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80" },
    { id: 104, name: "Grant Medical College, Mumbai", type: "Government Institute", city: "Mumbai", img: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80" },
    { id: 105, name: "Lokmanya Tilak Municipal Medical College", type: "Government Institute", city: "Mumbai", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" },
    { id: 106, name: "Government Medical College, Nagpur", type: "Government Institute", city: "Nagpur", img: "https://images.unsplash.com/photo-1592280771190-3e2e4d50c2fa?w=800&q=80" },
];

export function UniversityDetailTab({ university, onInstituteClick }: UniversityDetailTabProps) {
    const router = useRouter();
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                        Universities <ArrowRight className="h-3 w-3" /> {university.name}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{university.name}</h1>
                    <p className="text-slate-500 mt-1">{university.state} • {university.type}</p>
                </div>
                <Button variant="outline" className="border-slate-200 text-blue-600 hover:bg-blue-50">
                    Visit Official Website <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Institutes Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Institutes Affiliated ({mockInstitutes.length})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mockInstitutes.map((inst) => (
                        <div
                            key={inst.id}
                            onClick={() => onInstituteClick(inst)}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className="h-40 overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={inst.img}
                                    alt={inst.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                    <span className="text-xs font-bold text-slate-800">LOGO</span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                                    {inst.name}
                                </h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                    {university.name}
                                </p>

                                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Type</p>
                                        <p className="text-xs font-medium text-slate-700">Govt</p>
                                    </div>
                                    <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">City</p>
                                        <p className="text-xs font-medium text-slate-700">{inst.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
