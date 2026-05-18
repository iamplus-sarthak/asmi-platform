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

interface CounsellingsTabProps {
    onCounsellingClick: (counselling: any) => void;
}

const mockCounsellings = [
    { id: 1, name: "All India UG - Medical & Dental", authority: "All India", type: "All India", img: "/logos/mcc.png" },
    { id: 2, name: "AFMS (through MCC) - UG Medical", authority: "AFMS", type: "Central", img: "/logos/afms.png" },
    { id: 3, name: "Andaman & Nicobar Islands - UG Medical", authority: "Government Quota", type: "State", img: "/logos/an.png" },
    { id: 4, name: "Andhra Pradesh Government Quota - UG Medical", authority: "Government Quota", type: "State", img: "/logos/ap.png" },
    { id: 5, name: "Maharashtra - UG Medical", authority: "Government Quota and Management Quota", type: "State", img: "/logos/mh.png" },
    { id: 6, name: "Delhi - UG Medical", authority: "Government Quota", type: "State", img: "/logos/dl.png" },
    { id: 7, name: "Karnataka - UG Medical", authority: "Government Quota and Management Quota", type: "State", img: "/logos/ka.png" },
    { id: 8, name: "Tamil Nadu - UG Medical", authority: "Government Quota and Management Quota", type: "State", img: "/logos/tn.png" },
];

export function CounsellingsTab({ onCounsellingClick }: CounsellingsTabProps) {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Search Area */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Counsellings</h1>

                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search counsellings..."
                            className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 text-base rounded-2xl"
                        />
                    </div>

                    <div className="flex gap-4 max-w-xl mx-auto">
                        <Select>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1"><SelectValue placeholder="Counselling Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-india">All India</SelectItem>
                                <SelectItem value="state">State Quota</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1"><SelectValue placeholder="State / Authority" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mh">Maharashtra</SelectItem>
                                <SelectItem value="dl">Delhi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">43 Counsellings found</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCounsellings.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => onCounsellingClick(c)}
                        className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-5"
                    >
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            {/* Placeholder Logic for Logo */}
                            <span className="text-lg font-bold text-slate-400">
                                {c.name.charAt(0)}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                {c.name}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
                                {c.authority}
                            </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
