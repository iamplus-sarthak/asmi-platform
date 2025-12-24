"use client";

import React, { useState } from "react";
import { AdminSidebar, AdminTopNav } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { PDFParserSection } from "@/components/admin/sections/PDFParserSection";
import { UniversitiesSection } from "@/components/admin/sections/UniversitiesSection";
import { AnnouncementsSection } from "@/components/admin/sections/AnnouncementsSection";
import { SubscriptionsSection } from "@/components/admin/sections/SubscriptionsSection";
import { SupportSection } from "@/components/admin/sections/SupportSection";
import { AnalyticsSection } from "@/components/admin/sections/AnalyticsSection";

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return <AdminDashboard />;
            case "pdf-parser":
                return <PDFParserSection />;
            case "universities":
                return <UniversitiesSection />;
            case "announcements":
                return <AnnouncementsSection />;
            case "subscriptions":
                return <SubscriptionsSection />;
            case "support":
                return <SupportSection />;
            case "analytics":
                return <AnalyticsSection />;
            default:
                return (
                    <div className="p-8">
                        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {activeSection.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                            </h2>
                            <p className="text-slate-500">This section is under development</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminTopNav />
                <div className="flex-1 overflow-y-auto">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}
