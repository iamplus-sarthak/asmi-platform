"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { X, Home, Pin, Plus, Building2, Landmark, GraduationCap, PlayCircle, BookOpen, GitMerge, Trophy, Grid, CreditCard, ScanLine, Database, Search, User, Newspaper, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import new components
import { UniversitiesTab } from "@/components/dashboard/explore/UniversitiesTab";
import { UniversityDetailTab } from "@/components/dashboard/explore/UniversityDetailTab";
import { InstitutesTab } from "@/components/dashboard/explore/InstitutesTab";
import { InstituteDetailTab } from "@/components/dashboard/explore/InstituteDetailTab";
import { CounsellingsTab } from "@/components/dashboard/explore/CounsellingsTab";
import { CounsellingDetailTab } from "@/components/dashboard/explore/CounsellingDetailTab";
import { CoursesTab } from "@/components/dashboard/explore/CoursesTab";
import { VideosTab } from "@/components/dashboard/VideosTab";
import { ResourcesTab } from "@/components/dashboard/ResourcesTab";
import { HomeContent } from "@/components/dashboard/HomeContent";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { BlogsNewsTab } from "@/components/dashboard/BlogsNewsTab";
import { PackagesTab } from "@/components/dashboard/PackagesTab";
import { SupportTab } from "@/components/dashboard/SupportTab";
import { AnnouncementsTab } from "@/components/dashboard/AnnouncementsTab";

// Import Insight Tabs
import { AllotmentsTab } from "@/components/dashboard/insights/AllotmentsTab";
import { ClosingRanksTab } from "@/components/dashboard/insights/ClosingRanksTab";
import { SeatMatrixTab } from "@/components/dashboard/insights/SeatMatrixTab";
import { FeeStipendBondTab } from "@/components/dashboard/insights/FeeStipendBondTab";
import { AllotmentMappingTab } from "@/components/dashboard/tools/AllotmentMappingTab";
import { RankScanTab } from "@/components/dashboard/tools/RankScanTab";

// Interface for Tab Data
interface Tab {
    id: string;
    label: string;
    icon: any;
    pinned: boolean;
    type: "home" | "universities" | "university-detail" | "institutes" | "institute-detail" | "counsellings" | "counselling-detail" | "courses" | "videos" | "resources" | "announcements" | "allotments" | "closing-ranks" | "seat-matrix" | "fee-stipend" | "allotment-mapping" | "rank-scan" | "profile" | "blogs-news" | "packages" | "support" | "placeholder";
    data?: any;
}

const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="p-8 flex items-center justify-center h-[60vh] text-slate-400">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p>Content for {title} is coming soon.</p>
        </div>
    </div>
);

// Map slug array back to its Tab definition (for initialization and deep linking)
const getTabFromSlug = (slugArr?: string[]): Tab => {
    if (!slugArr || slugArr.length === 0) {
        return { id: "home", label: "Home", icon: Home, pinned: true, type: "home" };
    }

    const primaryRoute = slugArr[0];

    // Handle deep linked detail views
    if (primaryRoute === "universities" && slugArr.length > 1) {
        const univId = slugArr[1];
        return {
            id: `univ-${univId}`,
            label: "University Detail",
            icon: Landmark,
            pinned: false,
            type: "university-detail",
            data: { id: univId, name: "University Detail" }
        };
    }

    if (primaryRoute === "institutes" && slugArr.length > 1) {
        const instId = slugArr[1];
        return {
            id: `inst-${instId}`,
            label: "Institute Detail",
            icon: Building2,
            pinned: false,
            type: "institute-detail",
            data: { id: instId, name: "Institute Detail" }
        };
    }

    if (primaryRoute === "counsellings" && slugArr.length > 1) {
        const counsellingId = slugArr[1];
        return {
            id: `counselling-${counsellingId}`,
            label: "Counselling Detail",
            icon: GraduationCap,
            pinned: false,
            type: "counselling-detail",
            data: { id: counsellingId, name: "Counselling Detail" }
        };
    }

    // Handle primary static views
    switch (primaryRoute) {
        case "universities":
            return { id: "universities", label: "Universities", icon: Landmark, pinned: false, type: "universities" };
        case "institutes":
            return { id: "institutes", label: "Institutes", icon: Building2, pinned: false, type: "institutes" };
        case "counsellings":
            return { id: "counsellings", label: "Counsellings", icon: GraduationCap, pinned: false, type: "counsellings" };
        case "courses":
            return { id: "courses", label: "Courses", icon: BookOpen, pinned: false, type: "courses" };
        case "videos":
            return { id: "videos", label: "Videos", icon: PlayCircle, pinned: false, type: "videos" };
        case "resources":
            return { id: "resources", label: "Resources", icon: BookOpen, pinned: false, type: "resources" };
        case "announcements":
            return { id: "announcements", label: "Announcements", icon: Newspaper, pinned: false, type: "announcements" };
        case "allotments":
            return { id: "allotments", label: "Allotments", icon: GitMerge, pinned: false, type: "allotments" };
        case "closing-ranks":
            return { id: "closing-ranks", label: "Closing Ranks", icon: Trophy, pinned: false, type: "closing-ranks" };
        case "seat-matrix":
            return { id: "seat-matrix", label: "Seat Matrix", icon: Grid, pinned: false, type: "seat-matrix" };
        case "fee-stipend":
            return { id: "fee-stipend", label: "Fee, Stipend & Bond", icon: CreditCard, pinned: false, type: "fee-stipend" };
        case "allotment-mapping":
            return { id: "allotment-mapping", label: "Allotment Mapping", icon: GitMerge, pinned: false, type: "allotment-mapping" };
        case "rank-scan":
            return { id: "rank-scan", label: "Rank Scan", icon: Search, pinned: false, type: "rank-scan" };
        case "profile":
            return { id: "profile", label: "My Profile", icon: User, pinned: false, type: "profile" };
        case "blogs-news":
            return { id: "blogs-news", label: "Blogs & News", icon: Newspaper, pinned: false, type: "blogs-news" };
        case "packages":
            return { id: "packages", label: "Get a Package", icon: CreditCard, pinned: false, type: "packages" };
        case "support":
            return { id: "support", label: "Help & Support", icon: LifeBuoy, pinned: false, type: "support" };
        default:
            return {
                id: primaryRoute,
                label: primaryRoute.charAt(0).toUpperCase() + primaryRoute.slice(1),
                icon: Pin,
                pinned: false,
                type: "placeholder"
            };
    }
};

export default function DashboardClient() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string[] | undefined;

    // Derived State: active tab derived from the URL slug
    const activeTab = getTabFromSlug(slug);

    // List of active tabs state
    const [tabs, setTabs] = useState<Tab[]>([
        { id: "home", label: "Home", icon: Home, pinned: true, type: "home" },
    ]);

    // Keep tabs array synchronized with URL routing change
    useEffect(() => {
        setTabs(prev => {
            const exists = prev.find(t => t.id === activeTab.id);
            if (!exists) {
                return [...prev, activeTab];
            }
            return prev;
        });
    }, [slug, activeTab.id]);

    const handleTabClick = (tab: Tab) => {
        if (tab.id === "home") {
            router.push("/dashboard");
        } else if (tab.type === "university-detail" && tab.data) {
            router.push(`/dashboard/universities/${tab.data.id}`);
        } else if (tab.type === "institute-detail" && tab.data) {
            router.push(`/dashboard/institutes/${tab.data.id}`);
        } else if (tab.type === "counselling-detail" && tab.data) {
            router.push(`/dashboard/counsellings/${tab.data.id}`);
        } else {
            router.push(`/dashboard/${tab.id}`);
        }
    };

    const handleSidebarNavigate = (path: string, label: string) => {
        router.push(path);
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);

        // If we are closing the currently active tab, route to the last opened tab
        if (activeTab.id === id && newTabs.length > 0) {
            const lastTab = newTabs[newTabs.length - 1];
            handleTabClick(lastTab);
        }
    };

    // Cross-tab dynamic navigations (pushing browser router)
    const handleUniversityClick = (univ: any) => {
        router.push(`/dashboard/universities/${univ.id}`);
    };

    const handleInstituteClick = (inst: any) => {
        router.push(`/dashboard/institutes/${inst.id}`);
    };

    const handleCounsellingClick = (counselling: any) => {
        router.push(`/dashboard/counsellings/${counselling.id}`);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Sidebar onNavigate={handleSidebarNavigate} />
            <TopNav />

            {/* Main Content Area */}
            <div className="pl-[260px] pt-16">

                {/* Tab Bar */}
                <div className="h-10 bg-[#F1F5F9] border-b border-slate-200 flex items-center px-4 gap-1">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={cn(
                                "h-8 px-4 rounded-t-xl flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all border-t border-x min-w-[120px] max-w-[200px] group relative select-none",
                                activeTab.id === tab.id
                                    ? "bg-white text-blue-600 border-slate-200 border-b-transparent shadow-sm z-10"
                                    : "bg-transparent text-slate-500 border-transparent hover:bg-slate-200/50 hover:text-slate-700"
                            )}
                        >
                            <tab.icon className={cn("h-3.5 w-3.5 shrink-0", activeTab.id === tab.id ? "text-blue-600" : "text-slate-400")} />
                            <span className="truncate flex-1">{tab.label}</span>
                            {!tab.pinned && (
                                <button
                                    onClick={(e) => closeTab(e, tab.id)}
                                    className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 p-0.5 rounded-full transition-all"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white rounded-full ml-1 transition-all shadow-sm">
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {/* Page Content */}
                <div className="bg-white min-h-[calc(100vh-6.5rem)] relative shadow-[inset_0_2px_15px_-3px_rgba(0,0,0,0.02)] overflow-x-hidden">
                    {activeTab.type === "home" && <HomeContent />}

                    {activeTab.type === "universities" && (
                        <UniversitiesTab onUniversityClick={handleUniversityClick} />
                    )}

                    {activeTab.type === "university-detail" && (
                        <UniversityDetailTab
                            university={activeTab.data}
                            onInstituteClick={handleInstituteClick}
                        />
                    )}

                    {activeTab.type === "institutes" && (
                        <InstitutesTab onInstituteClick={handleInstituteClick} />
                    )}

                    {activeTab.type === "institute-detail" && (
                        <InstituteDetailTab institute={activeTab.data} />
                    )}

                    {activeTab.type === "counsellings" && (
                        <CounsellingsTab onCounsellingClick={handleCounsellingClick} />
                    )}

                    {activeTab.type === "counselling-detail" && (
                        <CounsellingDetailTab counselling={activeTab.data} />
                    )}

                    {activeTab.type === "courses" && (
                        <CoursesTab />
                    )}

                    {activeTab.type === "videos" && (
                        <VideosTab />
                    )}

                    {activeTab.type === "resources" && (
                        <ResourcesTab />
                    )}

                    {activeTab.type === "announcements" && (
                        <AnnouncementsTab />
                    )}

                    {activeTab.type === "allotments" && <AllotmentsTab />}
                    {activeTab.type === "closing-ranks" && <ClosingRanksTab />}
                    {activeTab.type === "seat-matrix" && <SeatMatrixTab />}
                    {activeTab.type === "fee-stipend" && <FeeStipendBondTab />}

                    {activeTab.type === "allotment-mapping" && <AllotmentMappingTab />}
                    {activeTab.type === "rank-scan" && <RankScanTab />}
                    {activeTab.type === "profile" && <ProfileTab />}
                    {activeTab.type === "blogs-news" && <BlogsNewsTab />}
                    {activeTab.type === "packages" && <PackagesTab />}
                    {activeTab.type === "support" && <SupportTab />}

                    {activeTab.type === "placeholder" && (
                        <PlaceholderContent title={activeTab.label} />
                    )}
                </div>

            </div>
        </div>
    );
}
