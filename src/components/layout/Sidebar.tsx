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

interface SidebarProps {
    onNavigate?: (path: string, label: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        insights: true,
        tools: false,
        explore: false,
    });

    React.useEffect(() => {
        if (pathname) {
            if (pathname.includes("/dashboard/allotments") || 
                pathname.includes("/dashboard/closing-ranks") || 
                pathname.includes("/dashboard/seat-matrix") || 
                pathname.includes("/dashboard/fee-stipend")) {
                setOpenGroups(prev => ({ ...prev, insights: true }));
            } else if (pathname.includes("/dashboard/allotment-mapping") || 
                       pathname.includes("/dashboard/rank-scan")) {
                setOpenGroups(prev => ({ ...prev, tools: true }));
            } else if (pathname.includes("/dashboard/institutes") || 
                       pathname.includes("/dashboard/universities") || 
                       pathname.includes("/dashboard/counsellings") || 
                       pathname.includes("/dashboard/courses")) {
                setOpenGroups(prev => ({ ...prev, explore: true }));
            }
        }
    }, [pathname]);

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

            <div className="flex-1 overflow-y-auto py-6 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                                                const isChildActive = pathname === child.path || (child.path !== "/dashboard" && pathname.startsWith(child.path));
                                                return (
                                                    <button
                                                        key={childIndex}
                                                        onClick={() => handleNavigation(child.path, child.label)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all relative z-10",
                                                            isChildActive
                                                                ? "text-blue-600 font-semibold bg-blue-50/50"
                                                                : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                                                        )}
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
                            const isItemActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path!));
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path!, item.label)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium",
                                        isItemActive
                                            ? "text-blue-600 font-semibold bg-blue-50/50"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5 transition-colors", isItemActive ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600")} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        }
                    })}
                </div>
            </div>

            {/* Bottom User Section */}
            <div className="p-4 border-t border-slate-100">
                <div 
                    onClick={() => handleNavigation("/dashboard/profile", "Profile")}
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                        pathname === "/dashboard/profile"
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                            : "bg-slate-50 border-slate-100/50 hover:bg-slate-100 text-slate-900"
                    )}
                >
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
