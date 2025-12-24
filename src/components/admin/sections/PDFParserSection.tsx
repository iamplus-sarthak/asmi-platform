"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function PDFParserSection() {
    const [uploadStep, setUploadStep] = useState<"upload" | "parsing" | "review">("upload");
    const [progress, setProgress] = useState(0);

    const mockParsedData = [
        { rank: "1", name: "Aarav Sharma", institute: "AIIMS Delhi", course: "MBBS", category: "General" },
        { rank: "2", name: "Diya Patel", institute: "AIIMS Mumbai", course: "MBBS", category: "General" },
        { rank: "3", name: "Rohan Kumar", institute: "JIPMER Puducherry", course: "MBBS", category: "OBC" },
        { rank: "4", name: "Ananya Singh", institute: "AIIMS Jodhpur", course: "MBBS", category: "General" },
        { rank: "5", name: "Arjun Reddy", institute: "MAMC Delhi", course: "MBBS", category: "SC" },
    ];

    const handleUpload = () => {
        setUploadStep("parsing");
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setUploadStep("review"), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">PDF Parser & Uploader</h1>
                <p className="text-slate-500 mt-1">Upload and parse government counselling documents</p>
            </div>

            {/* Upload Step */}
            {uploadStep === "upload" && (
                <Card className="p-8 border-slate-200">
                    <div className="max-w-2xl mx-auto">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Drop PDF files here</h3>
                            <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                            <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                                Select File
                            </Button>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Supports files up to 200MB</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Automatic data extraction and validation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Preview before committing to database</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Parsing Step */}
            {uploadStep === "parsing" && (
                <Card className="p-8 border-slate-200">
                    <div className="max-w-2xl mx-auto text-center">
                        <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Parsing Document...</h3>
                        <p className="text-sm text-slate-500 mb-6">Extracting data from NEET_2025_Allotment.pdf</p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-slate-600 mt-2">{progress}% complete</p>
                    </div>
                </Card>
            )}

            {/* Review Step */}
            {uploadStep === "review" && (
                <div className="space-y-4">
                    <Card className="p-6 border-slate-200 bg-green-50 border-green-200">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-900">Parsing Complete!</h3>
                                <p className="text-sm text-green-700">Successfully extracted 1,245 records. Review below before importing.</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Parsed Data Preview</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setUploadStep("upload")}>Cancel</Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">Import to Database</Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Student Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Institute</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Course</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockParsedData.map((row, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 text-sm text-slate-900">{row.rank}</td>
                                            <td className="py-3 px-4 text-sm text-slate-900">{row.name}</td>
                                            <td className="py-3 px-4 text-sm text-slate-600">{row.institute}</td>
                                            <td className="py-3 px-4 text-sm text-slate-600">{row.course}</td>
                                            <td className="py-3 px-4">
                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                                    {row.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">Showing 5 of 1,245 records</p>
                    </Card>
                </div>
            )}
        </div>
    );
}
