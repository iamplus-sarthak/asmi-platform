"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { X, Home, Pin, Plus, Building2, Landmark, GraduationCap, PlayCircle, BookOpen, GitMerge, Trophy, Grid, CreditCard, ScanLine, Database, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import new components
import { UniversitiesTab } from "@/components/dashboard/explore/UniversitiesTab";
import { UniversityDetailTab } from "@/components/dashboard/explore/UniversityDetailTab";
import { InstitutesTab } from "@/components/dashboard/explore/InstitutesTab";
import { InstituteDetailTab } from "@/components/dashboard/explore/InstituteDetailTab";
import { CounsellingsTab } from "@/components/dashboard/explore/CounsellingsTab";
import { CounsellingDetailTab } from "@/components/dashboard/explore/CounsellingDetailTab";
import { VideosTab } from "@/components/dashboard/VideosTab";
import { ResourcesTab } from "@/components/dashboard/ResourcesTab";
import { HomeContent } from "@/components/dashboard/HomeContent";

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
    type: "home" | "universities" | "university-detail" | "institutes" | "institute-detail" | "counsellings" | "counselling-detail" | "videos" | "resources" | "allotments" | "closing-ranks" | "seat-matrix" | "fee-stipend" | "allotment-mapping" | "rank-scan" | "placeholder";
    data?: any;
}


const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="p-8 flex items-center justify-center h-[60vh] text-slate-400">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p>Content for {title} is coming soon.</p>
        </div>
    </div>
)

export default function DashboardClient() {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: "home", label: "Home", icon: Home, pinned: true, type: "home" },
    ]);
    const [activeTabId, setActiveTabId] = useState("home");

    const openTab = (newTab: Tab) => {
        // Check if duplicate or update existing
        const existing = tabs.find(t => t.id === newTab.id);
        if (!existing) {
            setTabs([...tabs, newTab]);
        }
        setActiveTabId(newTab.id);
    };

    const handleSidebarNavigate = (path: string, label: string) => {
        // Mapping paths to Tab Types
        if (path === "/dashboard/universities") {
            openTab({ id: "universities", label: "Universities", icon: Landmark, pinned: false, type: "universities" });
        } else if (path === "/dashboard/institutes") {
            openTab({ id: "institutes", label: "Institutes", icon: Building2, pinned: false, type: "institutes" });
        } else if (path === "/dashboard/counsellings") {
            openTab({ id: "counsellings", label: "Counsellings", icon: GraduationCap, pinned: false, type: "counsellings" });
        } else if (path === "/dashboard/videos") {
            openTab({ id: "videos", label: "Videos", icon: PlayCircle, pinned: false, type: "videos" });
        } else if (path === "/dashboard/resources") {
            openTab({ id: "resources", label: "Resources", icon: BookOpen, pinned: false, type: "resources" });
        }
        // Insights
        else if (path === "/dashboard/allotments") {
            openTab({ id: "allotments", label: "Allotments", icon: GitMerge, pinned: false, type: "allotments" });
        } else if (path === "/dashboard/closing-ranks") {
            openTab({ id: "closing-ranks", label: "Closing Ranks", icon: Trophy, pinned: false, type: "closing-ranks" });
        } else if (path === "/dashboard/seat-matrix") {
            openTab({ id: "seat-matrix", label: "Seat Matrix", icon: Grid, pinned: false, type: "seat-matrix" });
        } else if (path === "/dashboard/fee-stipend") {
            openTab({ id: "fee-stipend", label: "Fee, Stipend & Bond", icon: CreditCard, pinned: false, type: "fee-stipend" });
        }
        // Tools
        else if (path === "/dashboard/allotment-mapping") {
            openTab({ id: "allotment-mapping", label: "Allotment Mapping", icon: GitMerge, pinned: false, type: "allotment-mapping" });
        } else if (path === "/dashboard/rank-scan") {
            openTab({ id: "rank-scan", label: "Rank Scan", icon: Search, pinned: false, type: "rank-scan" });
        }
        else {
            openTab({
                id: path,
                label,
                icon: Pin,
                pinned: false,
                type: "placeholder"
            });
        }
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id && newTabs.length > 0) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    // Handlers for cross-tab navigation
    const handleUniversityClick = (univ: any) => {
        openTab({
            id: `univ-${univ.id}`,
            label: univ.name,
            icon: Landmark,
            pinned: false,
            type: "university-detail",
            data: univ
        });
    };

    const handleInstituteClick = (inst: any) => {
        openTab({
            id: `inst-${inst.id}`,
            label: inst.name,
            icon: Building2,
            pinned: false,
            type: "institute-detail",
            data: inst
        });
    };

    const handleCounsellingClick = (counselling: any) => {
        openTab({
            id: `counselling-${counselling.id}`,
            label: counselling.name,
            icon: GraduationCap,
            pinned: false,
            type: "counselling-detail",
            data: counselling
        });
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

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
                            onClick={() => setActiveTabId(tab.id)}
                            className={cn(
                                "h-8 px-4 rounded-t-xl flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all border-t border-x min-w-[120px] max-w-[200px] group relative select-none",
                                activeTabId === tab.id
                                    ? "bg-white text-blue-600 border-slate-200 border-b-transparent shadow-sm z-10"
                                    : "bg-transparent text-slate-500 border-transparent hover:bg-slate-200/50 hover:text-slate-700"
                            )}
                        >
                            <tab.icon className={cn("h-3.5 w-3.5 shrink-0", activeTabId === tab.id ? "text-blue-600" : "text-slate-400")} />
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
                    {activeTab?.type === "home" && <HomeContent />}

                    {activeTab?.type === "universities" && (
                        <UniversitiesTab onUniversityClick={handleUniversityClick} />
                    )}

                    {activeTab?.type === "university-detail" && (
                        <UniversityDetailTab
                            university={activeTab.data}
                            onInstituteClick={handleInstituteClick}
                        />
                    )}

                    {activeTab?.type === "institutes" && (
                        <InstitutesTab onInstituteClick={handleInstituteClick} />
                    )}

                    {activeTab?.type === "institute-detail" && (
                        <InstituteDetailTab institute={activeTab.data} />
                    )}

                    {activeTab?.type === "counsellings" && (
                        <CounsellingsTab onCounsellingClick={handleCounsellingClick} />
                    )}

                    {activeTab?.type === "counselling-detail" && (
                        <CounsellingDetailTab counselling={activeTab.data} />
                    )}

                    {activeTab?.type === "videos" && (
                        <VideosTab />
                    )}

                    {activeTab?.type === "resources" && (
                        <ResourcesTab />
                    )}

                    {activeTab?.type === "allotments" && <AllotmentsTab />}
                    {activeTab?.type === "closing-ranks" && <ClosingRanksTab />}
                    {activeTab?.type === "seat-matrix" && <SeatMatrixTab />}
                    {activeTab?.type === "fee-stipend" && <FeeStipendBondTab />}

                    {activeTab?.type === "allotment-mapping" && <AllotmentMappingTab />}
                    {activeTab?.type === "rank-scan" && <RankScanTab />}

                    {activeTab?.type === "placeholder" && (
                        <PlaceholderContent title={activeTab.label} />
                    )}
                </div>

            </div>
        </div>
    );
}
