"use client";

import React, { useState } from "react";
import { Search, Info, Filter, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function AllotmentMappingTab() {
    const [hasSearched, setHasSearched] = useState(false);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] w-full min-h-[calc(100vh-4rem)]">
            <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Allotment Mapping
                        </h1>
                        <span className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-blue-600">
                            What&apos;s this?
                        </span>
                    </div>
                </div>

                {!hasSearched ? (
                    /* Initial State: Search Box */
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
                            <h2 className="text-xl font-semibold text-slate-800 mb-8">Select Counselling Details to Map Allotments</h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <Select>
                                    <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-600 rounded-xl px-4 text-base">
                                        <SelectValue placeholder="Select Session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select>
                                    <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-600 rounded-xl px-4 text-base md:col-span-2">
                                        <SelectValue placeholder="Select Counselling" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ap-govt">Andhra Pradesh Government Quota - UG Medical</SelectItem>
                                        <SelectItem value="all-india">All India UG - Medical & Dental</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select>
                                    <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-600 rounded-xl px-4 text-base">
                                        <SelectValue placeholder="Select Round" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Round 1</SelectItem>
                                        <SelectItem value="2">Round 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Button
                                    size="lg"
                                    className="bg-slate-400 hover:bg-slate-500 text-white font-semibold h-12 px-12 rounded-xl text-lg transition-colors"
                                    onClick={() => setHasSearched(true)}
                                >
                                    Go
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Result State: Complex Table */
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Select defaultValue="2023">
                                <SelectTrigger className="h-10 w-[100px] bg-white border-red-200 text-red-500 font-medium rounded-full"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="2023">2023</SelectItem></SelectContent>
                            </Select>

                            <Select defaultValue="ap-govt">
                                <SelectTrigger className="h-10 w-auto min-w-[300px] bg-white border-red-200 text-red-500 font-medium rounded-full"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="ap-govt">Andhra Pradesh Government Quota - UG Medical</SelectItem></SelectContent>
                            </Select>

                            <Select defaultValue="2">
                                <SelectTrigger className="h-10 w-[80px] bg-white border-red-200 text-red-500 font-medium rounded-full"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="2">2</SelectItem></SelectContent>
                            </Select>

                            <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20">
                                Go
                            </Button>

                            <div className="flex-1" />

                            <div className="relative w-[150px]">
                                <Select>
                                    <SelectTrigger className="h-10 bg-white border-slate-200 text-slate-600 rounded-full"><SelectValue placeholder="My Filters" /></SelectTrigger>
                                    <SelectContent><SelectItem value="custom">Custom</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" className="h-10 rounded-full text-slate-600 border-slate-200 hover:border-slate-300">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>

                        <div className="text-sm font-semibold text-slate-900">1 - 3 of 4640 Records</div>

                        {/* Complex Table */}
                        <div className="bg-white border md:border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="text-white uppercase text-xs font-bold tracking-wider">
                                            <th colSpan={6} className="bg-indigo-200 text-indigo-900 px-4 py-3 text-center border-r border-slate-900/10">
                                                ANDHRA PRADESH GOVERNMENT QUOTA - UG MEDICAL / ROUND 2
                                            </th>
                                            <th className="bg-black text-white px-2 py-3 text-center w-24">
                                                AI
                                            </th>
                                            <th colSpan={5} className="bg-blue-100 text-blue-900 px-4 py-3 text-center border-l border-slate-900/10">
                                                MAPPED TO OTHER COUNSELLINGS
                                            </th>
                                        </tr>
                                        <tr className="bg-indigo-100/50 text-indigo-900 text-xs font-bold uppercase border-b border-slate-200">
                                            <th className="px-4 py-3 w-16 text-center">RANK</th>
                                            <th className="px-4 py-3">QUOTA</th>
                                            <th className="px-4 py-3">CATEGORY</th>
                                            <th className="px-4 py-3">INSTITUTE</th>
                                            <th className="px-4 py-3">COURSE</th>
                                            <th className="px-4 py-3 text-center">ADMITTED</th>
                                            <th className="bg-black text-white px-2 py-3 text-center border-x border-white/20">RANK</th>
                                            <th className="px-4 py-3 w-16 text-center">RANK</th>
                                            <th className="px-4 py-3">COUNSELLING</th>
                                            <th className="px-4 py-3">INSTITUTE</th>
                                            <th className="px-4 py-3">COURSE</th>
                                            <th className="px-4 py-3 text-center">ROUND</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {/* Row 1 */}
                                        <tr className="group hover:bg-slate-50/80 transition-colors">
                                            {/* Student Details (Merged) */}
                                            <td className="px-4 py-4 font-bold text-center text-slate-900 align-top">40</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">AP Govt-UNR</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">OPEN-FEM</td>
                                            <td className="px-4 py-4 font-bold text-blue-700 align-top">Andhra Med Coll, Vizag</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">MBBS</td>
                                            <td className="px-4 py-4 text-center text-slate-400 align-top">-</td>

                                            {/* AI Rank (Center) */}
                                            <td className="bg-slate-50 px-2 py-4 text-center font-bold text-slate-900 align-top border-x border-slate-200">3339</td>

                                            {/* Mapped Rows */}
                                            <td colSpan={5} className="p-0 align-top">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr className="border-b border-slate-100 last:border-0 hover:bg-blue-50/50">
                                                            <td className="px-4 py-3 w-16 text-center font-medium text-slate-600">3339</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">All India UG - Medical & Dental</td>
                                                            <td className="px-4 py-3 font-medium text-slate-700">Gandhi Med Coll, Secunderabad</td>
                                                            <td className="px-4 py-3 font-medium text-slate-600">MBBS</td>
                                                            <td className="px-4 py-3 text-center font-medium text-slate-900">1</td>
                                                        </tr>
                                                        <tr className="border-b border-slate-100 last:border-0 hover:bg-blue-50/50">
                                                            <td className="px-4 py-3 w-16 text-center font-medium text-slate-600">3339</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">All India UG - Medical & Dental</td>
                                                            <td className="px-4 py-3 font-medium text-slate-700">Bangalore Med Coll, Bangalore</td>
                                                            <td className="px-4 py-3 font-medium text-slate-600">MBBS</td>
                                                            <td className="px-4 py-3 text-center font-medium text-slate-900">2</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        {/* Row 2 */}
                                        <tr className="group hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-4 font-bold text-center text-slate-900 align-top">73</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">AP Govt-UNR</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">OPEN-FEM</td>
                                            <td className="px-4 py-4 font-bold text-blue-700 align-top">Andhra Med Coll, Vizag</td>
                                            <td className="px-4 py-4 font-medium text-slate-700 align-top">MBBS</td>
                                            <td className="px-4 py-4 text-center text-slate-400 align-top">-</td>
                                            <td className="bg-slate-50 px-2 py-4 text-center font-bold text-slate-900 align-top border-x border-slate-200">4934</td>
                                            <td colSpan={5} className="p-0 align-top">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr className="border-b border-slate-100 last:border-0 hover:bg-blue-50/50">
                                                            <td className="px-4 py-3 w-16 text-center font-medium text-slate-600">4934</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">All India UG - Medical & Dental</td>
                                                            <td className="px-4 py-3 font-medium text-slate-700">Guntur Med Coll, Guntur</td>
                                                            <td className="px-4 py-3 font-medium text-slate-600">MBBS</td>
                                                            <td className="px-4 py-3 text-center font-medium text-slate-900">1</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
