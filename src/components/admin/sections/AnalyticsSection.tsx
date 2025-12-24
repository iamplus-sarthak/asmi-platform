"use client";

import React from "react";
import { Users, TrendingUp, Eye, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AnalyticsSection() {
    const userMetrics = [
        { label: "Total Users", value: "12,458", change: "+12.5%", trend: "up" },
        { label: "Active Today", value: "3,234", change: "+8.2%", trend: "up" },
        { label: "New This Week", value: "456", change: "+15.3%", trend: "up" },
        { label: "Retention Rate", value: "78.4%", change: "-2.1%", trend: "down" },
    ];

    const contentMetrics = [
        { label: "Most Viewed Institute", value: "AIIMS Delhi", views: "2,345" },
        { label: "Popular Counselling", value: "NEET UG 2025", views: "8,901" },
        { label: "Top Video", value: "How to Fill Choices", views: "5,678" },
        { label: "Most Downloaded", value: "Seat Matrix PDF", downloads: "1,234" },
    ];

    const revenueData = [
        { month: "Jan", revenue: "₹3,45,000", subscriptions: 234 },
        { month: "Feb", revenue: "₹4,12,000", subscriptions: 289 },
        { month: "Mar", revenue: "₹4,52,890", subscriptions: 312 },
    ];

    const toolUsage = [
        { tool: "Allotment Mapping", uses: 1234, percentage: 45 },
        { tool: "Rank Scan", uses: 987, percentage: 36 },
        { tool: "Closing Ranks", uses: 456, percentage: 17 },
        { tool: "Seat Matrix", uses: 234, percentage: 9 },
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time insights and performance metrics</p>
            </div>

            {/* User Metrics */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">User Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {userMetrics.map((metric, index) => (
                        <Card key={index} className="p-6 border-slate-200">
                            <p className="text-sm text-slate-500 mb-2">{metric.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</h3>
                            <div className="flex items-center gap-1">
                                {metric.trend === "up" ? (
                                    <ArrowUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <ArrowDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                    {metric.change}
                                </span>
                                <span className="text-sm text-slate-500">vs last month</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Content Performance */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Content Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contentMetrics.map((metric, index) => (
                        <Card key={index} className="p-6 border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Eye className="h-4 w-4 text-blue-600" />
                                <p className="text-sm text-slate-500">{metric.label}</p>
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">{metric.value}</h4>
                            <p className="text-sm text-slate-600">
                                {metric.views && `${metric.views} views`}
                                {metric.downloads && `${metric.downloads} downloads`}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Trends</h3>
                    <div className="space-y-4">
                        {revenueData.map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                                <div>
                                    <p className="text-sm text-slate-500">{data.month} 2025</p>
                                    <p className="text-lg font-bold text-slate-900">{data.revenue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Subscriptions</p>
                                    <p className="text-lg font-semibold text-blue-600">{data.subscriptions}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Tool Usage */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tool Usage</h3>
                    <div className="space-y-4">
                        {toolUsage.map((tool, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-900">{tool.tool}</span>
                                    <span className="text-sm text-slate-600">{tool.uses} uses</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${tool.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Engagement Stats */}
            <Card className="p-6 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Engagement Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg bg-blue-50">
                        <p className="text-sm text-blue-600 font-medium mb-2">Avg. Session Duration</p>
                        <p className="text-3xl font-bold text-blue-900">12m 34s</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-green-50">
                        <p className="text-sm text-green-600 font-medium mb-2">Pages Per Session</p>
                        <p className="text-3xl font-bold text-green-900">8.4</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-purple-50">
                        <p className="text-sm text-purple-600 font-medium mb-2">Bounce Rate</p>
                        <p className="text-3xl font-bold text-purple-900">23.5%</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
