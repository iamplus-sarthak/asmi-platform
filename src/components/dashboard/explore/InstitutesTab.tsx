"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface InstitutesTabProps {
    onInstituteClick: (inst: any) => void;
}

const mockInstitutes = [
    { id: 201, name: "All India Institute of Medical Sciences, New Delhi", type: "INI", city: "Delhi", img: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80" },
    { id: 202, name: "Maulana Azad Medical College, New Delhi", type: "Govt", city: "Delhi", img: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80" },
    { id: 203, name: "Christian Medical College, Vellore", type: "Private", city: "Vellore", img: "https://images.unsplash.com/photo-1581093458891-8f30864411f8?w=800&q=80" },
    { id: 204, name: "B. J. Govt. Medical College, Pune", type: "Govt", city: "Pune", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" },
    { id: 205, name: "Madras Medical College, Chennai", type: "Govt", city: "Chennai", img: "https://images.unsplash.com/photo-1516575306052-b9576594d651?w=800&q=80" },
    { id: 206, name: "Kasturba Medical College, Manipal", type: "Deemed", city: "Manipal", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" },
    { id: 207, name: "King George's Medical University, Lucknow", type: "Govt", city: "Lucknow", img: "https://images.unsplash.com/photo-1596464716127-f9a8a4e04130?w=800&q=80" },
    { id: 208, name: "Institute of Medical Sciences BHU, Varanasi", type: "Central", city: "Varanasi", img: "https://images.unsplash.com/photo-1590073242678-cfea500593c2?w=800&q=80" },
];

export function InstitutesTab({ onInstituteClick }: InstitutesTabProps) {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Search Area (Similar to design) */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Institutes</h1>

                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search institutes..."
                            className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 text-base rounded-2xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Select>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="Institute Type" /></SelectTrigger>
                            <SelectContent><SelectItem value="govt">Government</SelectItem><SelectItem value="pvt">Private</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="Authority / Board" /></SelectTrigger>
                            <SelectContent><SelectItem value="mcc">MCC</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="State" /></SelectTrigger>
                            <SelectContent><SelectItem value="mh">Maharashtra</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl"><SelectValue placeholder="University" /></SelectTrigger>
                            <SelectContent><SelectItem value="muhs">MUHS</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-sm text-slate-500 font-medium pt-2">1146 Institutes found</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockInstitutes.map((inst) => (
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
                                Affiliated to Some University
                            </p>

                            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                        <span className="text-xs">🏠</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Type</p>
                                        <p className="text-xs font-semibold text-slate-700">{inst.type}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                        <span className="text-xs">📍</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">City</p>
                                        <p className="text-xs font-semibold text-slate-700">{inst.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
