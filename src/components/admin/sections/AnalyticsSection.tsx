"use client";

import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Eye, DollarSign, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAnalyticsDataAction } from "@/actions/admin";

export function AnalyticsSection() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAnalyticsDataAction().then(res => {
            if (res.success) {
                setData(res.data);
            }
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center min-h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const userMetrics = data ? [
        { label: "Total Users", value: data.users.total.toLocaleString(), change: data.users.totalChange || "+0%", trend: data.users.totalTrend || "up", period: "vs last month" },
        { label: "Active Today", value: data.users.activeToday.toLocaleString(), change: data.users.activeChange || "+0%", trend: data.users.activeTrend || "up", period: "vs yesterday" },
        { label: "New This Week", value: data.users.newThisWeek.toLocaleString(), change: data.users.newWeekChange || "+0%", trend: data.users.newWeekTrend || "up", period: "vs last week" },
        { 
            label: "Retention Rate", 
            value: `${data.users?.retentionRate || 0}%`, 
            change: data.users?.retentionChange || "+0%", 
            trend: data.users?.retentionTrend || "up",
            period: "vs last month"
        },
    ] : [];

    const contentMetrics = data ? [
        { label: "Most Viewed Institute", value: data.content.topInstitute?.name || "N/A", views: data.content.topInstitute?.views || 0 },
        { label: "Popular Counselling", value: data.content.topCounselling?.name || "N/A", views: data.content.topCounselling?.views || 0 },
        { label: "Top Video", value: data.content.topVideo?.title || "N/A", views: data.content.topVideo?.views || 0 },
        { label: "Most Downloaded", value: data.content.topResource?.title || "N/A", downloads: data.content.topResource?.downloads || 0 },
    ] : [];

    const revenueData = data?.revenue?.length ? data.revenue : [];

    const toolUsage = data?.platform?.tool_usage?.length ? data.platform.tool_usage : [];

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
                                <span className="text-sm text-slate-500">{metric.period}</span>
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
                                {metric.views !== undefined && `${metric.views.toLocaleString()} views`}
                                {metric.downloads !== undefined && `${metric.downloads.toLocaleString()} downloads`}
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
                        {revenueData.length === 0 ? (
                            <p className="text-slate-500 text-sm">No revenue data available.</p>
                        ) : (
                            revenueData.map((rev: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                                    <div>
                                        <p className="text-sm text-slate-500">{rev.month} {new Date().getFullYear()}</p>
                                        <p className="text-lg font-bold text-slate-900">{rev.revenue}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Subscriptions</p>
                                        <p className="text-lg font-semibold text-blue-600">{rev.subscriptions}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Tool Usage */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tool Usage</h3>
                    <div className="space-y-4">
                        {toolUsage.length === 0 ? (
                            <p className="text-slate-500 text-sm">No tool usage data available.</p>
                        ) : (
                            toolUsage.map((tool: any, index: number) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-900">{tool.tool}</span>
                                        <span className="text-sm text-slate-600">{tool.uses.toLocaleString()} uses</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${tool.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Engagement Stats */}
            <Card className="p-6 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Engagement Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg bg-blue-50">
                        <p className="text-sm text-blue-600 font-medium mb-2">Avg. Session Duration</p>
                        <p className="text-3xl font-bold text-blue-900">{data?.platform?.avg_session_duration || "0m 0s"}</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-green-50">
                        <p className="text-sm text-green-600 font-medium mb-2">Pages Per Session</p>
                        <p className="text-3xl font-bold text-green-900">{data?.platform?.pages_per_session || "0"}</p>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-purple-50">
                        <p className="text-sm text-purple-600 font-medium mb-2">Bounce Rate</p>
                        <p className="text-3xl font-bold text-purple-900">{data?.platform?.bounce_rate || "0"}%</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
