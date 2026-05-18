"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlayCircle,
    BarChart2,
    Wrench,
    Compass,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Database,
    Trophy,
    Grid,
    CreditCard,
    GitMerge,
    ScanLine,
    Building2,
    Landmark,
    GraduationCap,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
    onNavigate?: (path: string, label: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        insights: true,
        tools: false,
        explore: false,
    });

    const toggleGroup = (key: string) => {
        setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
            type: "link"
        },
        {
            label: "Videos",
            icon: PlayCircle,
            path: "/dashboard/videos",
            type: "link"
        },
        {
            label: "Insights",
            icon: BarChart2,
            type: "group",
            key: "insights",
            children: [
                { label: "Allotments", icon: GitMerge, path: "/dashboard/allotments" },
                { label: "Closing Ranks", icon: Trophy, path: "/dashboard/closing-ranks" },
                { label: "Seat Matrix", icon: Grid, path: "/dashboard/seat-matrix" },
                { label: "Fee, Stipend & Bond", icon: CreditCard, path: "/dashboard/fee-stipend" },
            ]
        },
        {
            label: "Tools",
            icon: Wrench,
            type: "group",
            key: "tools",
            children: [
                { label: "Allotment Mapping", icon: Database, path: "/dashboard/allotment-mapping" },
                { label: "Rank Scan", icon: ScanLine, path: "/dashboard/rank-scan" },
            ]
        },
        {
            label: "Explore",
            icon: Compass,
            type: "group",
            key: "explore",
            children: [
                { label: "Institutes", icon: Building2, path: "/dashboard/institutes" },
                { label: "Universities", icon: Landmark, path: "/dashboard/universities" },
                { label: "Counsellings", icon: GraduationCap, path: "/dashboard/counsellings" },
                { label: "Courses", icon: BookOpen, path: "/dashboard/courses" },
            ]
        },
        {
            label: "Resources",
            icon: BookOpen,
            path: "/dashboard/resources",
            type: "link"
        },
    ];

    const handleNavigation = (path: string, label: string) => {
        if (onNavigate) {
            onNavigate(path, label);
        }
    };

    return (
        <div className="w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40 shadow-sm">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div 
                    onClick={() => handleNavigation("/dashboard", "Home")}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                        Asmi
                    </span>
                </div>
            </div>

            <ScrollArea className="flex-1 py-6 px-4">
                <div className="space-y-2">
                    {menuItems.map((item, index) => {
                        if (item.type === "group") {
                            const isOpen = openGroups[item.key!];
                            const Icon = item.icon;
                            return (
                                <div key={index} className="space-y-1">
                                    <button
                                        onClick={() => toggleGroup(item.key!)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all group font-medium",
                                            isOpen && "text-blue-700 bg-blue-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn("h-5 w-5", isOpen ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600")} />
                                            <span>{item.label}</span>
                                        </div>
                                        {isOpen ? (
                                            <ChevronDown className="h-4 w-4 text-blue-500" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="pl-4 space-y-1 mt-1 relative">
                                            {/* Vertical line indicator */}
                                            <div className="absolute left-9 top-0 bottom-0 w-px bg-slate-200" />

                                            {item.children?.map((child, childIndex) => {
                                                const ChildIcon = child.icon;
                                                return (
                                                    <button
                                                        key={childIndex}
                                                        onClick={() => handleNavigation(child.path, child.label)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all relative z-10"
                                                    >
                                                        <ChildIcon className="h-4 w-4" />
                                                        <span>{child.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path!, item.label)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all group font-medium"
                                >
                                    <Icon className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        }
                    })}
                </div>
            </ScrollArea>

            {/* Bottom User Section */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                        S
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">Student Account</p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
