"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: SearchBarProps) {
    return (
        <div className={cn("relative w-full", className)}>
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 text-base rounded-2xl"
            />
        </div>
    );
}
