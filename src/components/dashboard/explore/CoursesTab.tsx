"use client";

import React, { useState, useEffect } from "react";
import { getDocsAction } from "@/actions/admin-crud";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Activity, Loader2 } from "lucide-react";

export function CoursesTab() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedDegree, setSelectedDegree] = useState("all");

    const [coursesList, setCoursesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getDocsAction({ collection: "courses", limit: 200 });
                if (res.success && res.data?.docs) {
                    setCoursesList(res.data.docs);
                }
            } catch (err) {
                console.error("Failed to load courses:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Dynamic filtering
    const filteredCourses = coursesList.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || c.course_type === selectedType;
        const matchesDegree = selectedDegree === "all" || c.degree_type === selectedDegree;
        
        return matchesSearch && matchesType && matchesDegree;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Search Area */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Medical Courses</h1>

                <div className="max-w-3xl mx-auto space-y-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search courses (e.g. MBBS, BDS)..."
                    />

                    <div className="flex gap-4 max-w-xl mx-auto">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="Course Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="clinical">Clinical</SelectItem>
                                <SelectItem value="para_clinical">Para-Clinical</SelectItem>
                                <SelectItem value="non_clinical">Non-Clinical</SelectItem>
                                <SelectItem value="pre_clinical">Pre-Clinical</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl flex-1 text-slate-700">
                                <SelectValue placeholder="Degree Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-700">
                                <SelectItem value="all">All Degrees</SelectItem>
                                <SelectItem value="medical">Medical</SelectItem>
                                <SelectItem value="dental">Dental</SelectItem>
                                <SelectItem value="diploma">Diploma</SelectItem>
                                <SelectItem value="bsc">BSc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">{filteredCourses.length} Courses found</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all flex flex-col h-full animate-in fade-in duration-300"
                        >
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{c.name}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                            {c.degree_type?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                            <Activity className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Type</p>
                                            <p className="text-xs font-semibold text-slate-700 truncate capitalize">{c.course_type?.replace('_', '-')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                            <Clock className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Duration</p>
                                            <p className="text-xs font-semibold text-slate-700 truncate">{c.duration || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
                        No courses found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
