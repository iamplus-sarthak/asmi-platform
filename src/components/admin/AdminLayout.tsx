"use client";

import React from "react";
import { LayoutDashboard, Database, FileText, Megaphone, CreditCard, Headphones, BarChart3, ChevronDown, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
    const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["data", "content"]);

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev =>
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            section: "dashboard"
        },
        {
            id: "data",
            label: "Data Management",
            icon: Database,
            isGroup: true,
            children: [
                { id: "pdf-parser", label: "PDF Parser", section: "pdf-parser" },
                { id: "allotments", label: "Allotment Data", section: "allotments" },
                { id: "closing-ranks", label: "Closing Ranks", section: "closing-ranks" },
                { id: "seat-matrix", label: "Seat Matrix", section: "seat-matrix" },
            ]
        },
        {
            id: "content",
            label: "Content Management",
            icon: FileText,
            isGroup: true,
            children: [
                { id: "universities", label: "Universities", section: "universities" },
                { id: "institutes", label: "Institutes", section: "institutes" },
                { id: "counsellings", label: "Counsellings", section: "counsellings" },
                { id: "videos", label: "Videos", section: "videos" },
                { id: "resources", label: "Resources", section: "resources" },
            ]
        },
        {
            id: "announcements",
            label: "Announcements",
            icon: Megaphone,
            section: "announcements"
        },
        {
            id: "subscriptions",
            label: "Subscriptions",
            icon: CreditCard,
            section: "subscriptions"
        },
        {
            id: "support",
            label: "Support",
            icon: Headphones,
            section: "support",
            badge: "12"
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            section: "analytics"
        },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Asmi Admin</h1>
                        <p className="text-xs text-slate-500">Management Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                    if (item.isGroup) {
                        const isExpanded = expandedGroups.includes(item.id);
                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => toggleGroup(item.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                                </button>
                                {isExpanded && item.children && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => onSectionChange(child.section)}
                                                className={cn(
                                                    "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                                                    activeSection === child.section
                                                        ? "bg-blue-50 text-blue-600 font-medium"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => item.section && onSectionChange(item.section)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                activeSection === item.section
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function AdminTopNav() {
    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search anything..."
                        className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">Admin User</p>
                        <p className="text-xs text-slate-500">admin@asmi.com</p>
                    </div>
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
