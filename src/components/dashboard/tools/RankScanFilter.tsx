"use client";

import React from "react";
import { X, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RankScanFilterProps {
    onClose: () => void;
    onApply: () => void;
}

export function RankScanFilter({ onClose, onApply }: RankScanFilterProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[1000px] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100">
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 h-full">

                        {/* Column 1 */}
                        <div className="p-6 space-y-6">
                            {/* AI Rank */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">AI Rank</Label>
                                <div className="flex items-center gap-2">
                                    <Input placeholder="0" className="h-9 w-full font-medium" />
                                    <span className="text-slate-400">-</span>
                                    <Input placeholder="50000000" className="h-9 w-full font-medium" />
                                </div>
                            </div>

                            {/* Session */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Session</Label>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-200" />
                                        2025
                                    </span>
                                </div>
                            </div>

                            {/* Rounds */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Rounds</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["0", "1", "2", "2.5", "3", "3.5", "4", "5", "6"].map((round) => (
                                        <div key={round} className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
                                            {round}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Counselling */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Counselling</Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search Counselling" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>

                            {/* Quota */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Quota</Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search Quota" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>

                            {/* Category */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Category</Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search Category" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="p-6 space-y-6">
                            {/* State */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">State <span className="font-normal text-slate-400 text-xs ml-1">(Selection will filter Institutes as well)</span></Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search State" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>

                            {/* Institute */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Institute <span className="font-normal text-slate-400 text-xs ml-1">(1102)</span></Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search Institute" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>

                            {/* Institute Type */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Institute Type</Label>
                                <Select>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200"><SelectValue placeholder="Search Institute Type" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                                </Select>
                            </div>

                            {/* Admission Status */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Admission Status</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="admitted" />
                                        <label htmlFor="admitted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Admitted</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="not-admitted" />
                                        <label htmlFor="not-admitted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Not Admitted</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="info-na" />
                                        <label htmlFor="info-na" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Info NA</label>
                                    </div>
                                </div>
                            </div>

                            {/* Joined Status */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Joined Status</Label>
                                <div className="flex items-center gap-2">
                                    <Switch id="joined-status" />
                                    <Label htmlFor="joined-status" className="font-medium text-slate-700">Show only joined allotments.</Label>
                                </div>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="p-6 space-y-6">
                            {/* Course */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-900">Course</Label>
                                <RadioGroup defaultValue="mbbs">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mbbs" id="mbbs" />
                                        <Label htmlFor="mbbs">MBBS</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="bds" id="bds" />
                                        <Label htmlFor="bds">BDS</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                    </div>

                    {/* Display Fields Section (Footer) */}
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                        <Label className="text-sm font-bold text-slate-900 mb-4 block">Displayed Fields</Label>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ai-rank" defaultChecked className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                                <label htmlFor="ai-rank" className="text-sm font-semibold">AI Rank</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="counselling" defaultChecked className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                                <label htmlFor="counselling" className="text-sm font-semibold">Counselling</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="round" defaultChecked className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                                <label htmlFor="round" className="text-sm font-semibold">Round</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="state" defaultChecked className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                                <label htmlFor="state" className="text-sm font-semibold">State</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="institute" defaultChecked className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                                <label htmlFor="institute" className="text-sm font-semibold">Institute</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900">
                        Clear Filters
                    </Button>

                    <div className="flex items-center gap-3">
                        <Select>
                            <SelectTrigger className="h-10 w-[140px] border-slate-200"><SelectValue placeholder="Select filter" /></SelectTrigger>
                            <SelectContent><SelectItem value="1">Filter 1</SelectItem></SelectContent>
                        </Select>
                        <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-6 rounded-xl shadow-lg shadow-blue-600/20">
                            View Results
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
