"use client";

import React from "react";
import { Search, Filter, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UniversitiesTabProps {
    onUniversityClick: (univ: any) => void;
}

const mockUniversities = [
    { id: 1, name: "Maharashtra University of Health Sciences, Nashik", state: "Maharashtra", type: "State Govt University", count: 98 },
    { id: 2, name: "Rajiv Gandhi University of Health Sciences", state: "Karnataka", type: "State Govt University", count: 145 },
    { id: 3, name: "All India Institute of Medical Sciences (AIIMS)", state: "Delhi", type: "Central Autonomous", count: 20 },
    { id: 4, name: "Dr. M.G.R. Medical University", state: "Tamil Nadu", type: "State Govt University", count: 112 },
    { id: 5, name: "Gujarat University", state: "Gujarat", type: "State Govt University", count: 45 },
];

export function UniversitiesTab({ onUniversityClick }: UniversitiesTabProps) {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Universities</h1>

                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search universities..."
                            className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 text-base rounded-xl"
                        />
                    </div>

                    <div className="flex gap-4">
                        <Select>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1">
                                <SelectValue placeholder="University Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="state">State Govt University</SelectItem>
                                <SelectItem value="central">Central University</SelectItem>
                                <SelectItem value="deemed">Deemed University</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1">
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mh">Maharashtra</SelectItem>
                                <SelectItem value="ka">Karnataka</SelectItem>
                                <SelectItem value="dl">Delhi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="text-sm text-slate-500 font-medium">195 Universities found</p>
            </div>

            {/* List Section */}
            <div className="grid gap-4">
                {mockUniversities.map((univ) => (
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
                ))}
            </div>
        </div>
    );
}
