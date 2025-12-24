"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UniversitiesSection() {
    const [searchQuery, setSearchQuery] = useState("");

    const universities = [
        { id: 1, name: "All India Institute of Medical Sciences", type: "Central", state: "Multi-State", institutes: 24, status: "Active" },
        { id: 2, name: "Jawaharlal Institute of Postgraduate Medical Education", type: "Central", state: "Puducherry", institutes: 1, status: "Active" },
        { id: 3, name: "Banaras Hindu University", type: "Central", state: "Uttar Pradesh", institutes: 3, status: "Active" },
        { id: 4, name: "King George's Medical University", type: "State", state: "Uttar Pradesh", institutes: 1, status: "Active" },
        { id: 5, name: "Maulana Azad Medical College", type: "State", state: "Delhi", institutes: 1, status: "Active" },
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Universities</h1>
                    <p className="text-slate-500 mt-1">Manage universities and their affiliated institutes</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add University
                </Button>
            </div>

            <Card className="p-6 border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Export</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">University Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Type</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">State</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Institutes</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {universities.map((university) => (
                                <tr key={university.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{university.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${university.type === "Central" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                            }`}>
                                            {university.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600">{university.state}</td>
                                    <td className="py-4 px-4 text-sm text-slate-900 font-medium">{university.institutes}</td>
                                    <td className="py-4 px-4">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                                            {university.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
