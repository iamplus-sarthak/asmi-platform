"use client";

import React from "react";
import { TrendingUp, Users, DollarSign, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AdminDashboard() {
    const stats = [
        {
            label: "Total Students",
            value: "12,458",
            change: "+12.5%",
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Active Subscriptions",
            value: "8,234",
            change: "+8.2%",
            trend: "up",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            label: "Monthly Revenue",
            value: "₹4,52,890",
            change: "+15.3%",
            trend: "up",
            icon: DollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            label: "Support Tickets",
            value: "12",
            change: "-23.1%",
            trend: "down",
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
    ];

    const recentActivity = [
        { action: "New student registered", user: "Rahul Sharma", time: "2 minutes ago" },
        { action: "Subscription purchased", user: "Priya Patel", time: "15 minutes ago" },
        { action: "Support ticket created", user: "Amit Kumar", time: "1 hour ago" },
        { action: "PDF uploaded", user: "Admin", time: "2 hours ago" },
        { action: "Announcement published", user: "Admin", time: "3 hours ago" },
    ];

    const pendingTasks = [
        { task: "Review 3 new support tickets", priority: "high" },
        { task: "Upload NEET 2025 closing ranks data", priority: "medium" },
        { task: "Approve 2 pending announcements", priority: "low" },
        { task: "Update JEE Main seat matrix", priority: "medium" },
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                                <div className="flex items-center gap-1 mt-2">
                                    {stat.trend === "up" ? (
                                        <ArrowUp className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-slate-500">vs last month</span>
                                </div>
                            </div>
                            <div className={`h-12 w-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                                    <p className="text-sm text-slate-500">{activity.user}</p>
                                </div>
                                <span className="text-xs text-slate-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Pending Tasks */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Pending Tasks</h3>
                    <div className="space-y-3">
                        {pendingTasks.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="flex-1 text-sm text-slate-900">{item.task}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.priority === "high" ? "bg-red-100 text-red-600" :
                                        item.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                                            "bg-green-100 text-green-600"
                                    }`}>
                                    {item.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
