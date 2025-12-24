"use client";

import React from "react";
import { Search, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CounsellingSelectorProps {
    title: string;
    onSelect: (counsellingName: string) => void;
    onClose: () => void;
}

const counsellings = [
    "All India UG - Medical & Dental",
    "Open Seats (Private Institute seats available for all candidates)",
    "Andaman & Nicobar Islands - UG Medical",
    "Andhra Pradesh Government Quota - UG Medical",
    "Andhra Pradesh Management Quota - UG Medical",
    "Arunachal Pradesh - UG Medical",
    "Assam - UG Medical",
    "Bihar - UG Medical",
    "Chandigarh - UG Medical",
    "Chhattisgarh - UG Medical",
    "Dadra and Nagar Haveli - UG Medical",
];

export function CounsellingSelector({ title, onSelect, onClose }: CounsellingSelectorProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100">
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search Counselling"
                            className="pl-9 h-10 bg-white border-slate-200 rounded-xl"
                            autoFocus
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 p-2">
                    <div className="space-y-1">
                        {counsellings.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => onSelect(c)}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50 rounded-xl transition-colors group text-left"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-blue-700">{c}</span>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
