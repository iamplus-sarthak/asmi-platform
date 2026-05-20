"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    label?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    label = "Showing Results",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none">
            <span className="text-sm text-slate-500 font-medium">
                {label}
            </span>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className="h-9 w-9 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "h-9 min-w-9 px-2 rounded-xl font-medium text-sm transition-all",
                            currentPage === page
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                        )}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    className="h-9 w-9 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
