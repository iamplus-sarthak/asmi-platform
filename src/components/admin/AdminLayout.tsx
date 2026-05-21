"use client";

import React from "react";
import { LayoutDashboard, Database, FileText, Megaphone, CreditCard, Headphones, BarChart3, ChevronDown, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { usePathname, useRouter } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["data", "content"]);
    const [unreadSupportCount, setUnreadSupportCount] = React.useState<number>(0);

    React.useEffect(() => {
        import("@/actions/admin-crud").then(({ getDocsAction }) => {
            getDocsAction({
                collection: "support_tickets",
                query: { is_read_admin: { equals: false }, status: { not_equals: "closed" } },
                limit: 1
            }).then((res) => {
                if (res.success && res.data?.totalDocs) {
                    setUnreadSupportCount(res.data.totalDocs);
                } else if (res.success && res.data?.docs) {
                    setUnreadSupportCount(res.data.docs.length);
                }
            }).catch(console.error);
        });
    }, []);

    // Determine the active section from the URL path.

    const activeSection = pathname === "/admin" ? "dashboard" : pathname.split("/")[2] || "dashboard";

    const handleSectionChange = (section: string) => {
        if (section === "dashboard") {
            router.push("/admin");
        } else {
            router.push(`/admin/${section}`);
        }
    };

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
                { id: "academic-years", label: "Academic Years", section: "academic-years" },
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
                {
                    id: "exams-group",
                    label: "Exams & Courses",
                    isSubGroup: true,
                    children: [
                        { id: "exams", label: "Entrance Exams", section: "exams" },
                        { id: "courses", label: "Master Courses", section: "courses" },
                        { id: "exam-courses", label: "Mapped Courses", section: "exam-courses" },
                    ]
                },
                {
                    id: "institutes-group",
                    label: "Institutes",
                    isSubGroup: true,
                    children: [
                        { id: "institutes", label: "All Institutes", section: "institutes" },
                        { id: "institute-types", label: "Institute Types", section: "institute-types" },
                        { id: "institute-courses", label: "Courses", section: "institute-courses" },
                        { id: "institute-fees", label: "Course Fees", section: "institute-course-fees" },
                        { id: "institute-hospitals", label: "Hospitals", section: "institute-hospitals" },
                        { id: "institute-hostels", label: "Hostels", section: "institute-hostels" },
                    ]
                },
                {
                    id: "counsellings-group",
                    label: "Counsellings",
                    isSubGroup: true,
                    children: [
                        { id: "counsellings", label: "All Counsellings", section: "counsellings" },
                        { id: "counselling-quotas", label: "Quotas", section: "counselling-quotas" },
                        { id: "counselling-timelines", label: "Timelines", section: "counselling-timelines" },
                        { id: "counselling-cycles", label: "Cycles", section: "counselling-cycles" },
                        { id: "counselling-institutes", label: "Mapped Institutes", section: "counselling-institutes" },
                    ]
                },
                { id: "videos", label: "Videos", section: "videos" },
                { id: "resources", label: "Resources", section: "resources" },
            ]
        },
        {
            id: "announcements-group",
            label: "Announcements",
            icon: Megaphone,
            isGroup: true,
            children: [
                { id: "general-announcements", label: "General", section: "announcements" },
                { id: "counselling-announcements", label: "Counselling Updates", section: "counselling-announcements" },
            ]
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
            badge: unreadSupportCount > 0 ? unreadSupportCount.toString() : undefined
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            section: "analytics"
        },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
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
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                                </button>
                                {isExpanded && item.children && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.children.map((child: any) => {
                                            if (child.isSubGroup) {
                                                const isSubExpanded = expandedGroups.includes(child.id);
                                                return (
                                                    <div key={child.id}>
                                                        <button
                                                            onClick={() => toggleGroup(child.id)}
                                                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                                        >
                                                            <span>{child.label}</span>
                                                            <ChevronDown className={cn("h-3 w-3 transition-transform", isSubExpanded && "rotate-180")} />
                                                        </button>
                                                        {isSubExpanded && child.children && (
                                                            <div className="ml-2 mt-1 space-y-1 border-l border-slate-200 pl-2">
                                                                {child.children.map((subChild: any) => (
                                                                    <button
                                                                        key={subChild.id}
                                                                        onClick={() => handleSectionChange(subChild.section)}
                                                                        className={cn(
                                                                            "w-full flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors",
                                                                            activeSection === subChild.section
                                                                                ? "bg-blue-50 text-blue-600 font-medium"
                                                                                : "text-slate-600 hover:bg-slate-50"
                                                                        )}
                                                                    >
                                                                        {subChild.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            }

                                            return (
                                                <button
                                                    key={child.id}
                                                    onClick={() => handleSectionChange(child.section)}
                                                    className={cn(
                                                        "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                                                        activeSection === child.section
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-slate-600 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {child.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => item.section && handleSectionChange(item.section)}
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
