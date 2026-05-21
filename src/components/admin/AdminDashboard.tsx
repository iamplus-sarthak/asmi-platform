"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, FileText, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDashboardDataAction, toggleAdminTaskAction } from "@/actions/admin";

export function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            const res = await getDashboardDataAction();
            if (res.success) {
                setData(res);
            }
            setIsLoading(false);
        };
        loadDashboard();
    }, []);

    const handleTaskToggle = async (taskId: string, isCompleted: boolean, type: string) => {
        // Optimistic UI update
        setData((prev: any) => ({
            ...prev,
            pendingTasks: prev.pendingTasks.filter((t: any) => t.id !== taskId)
        }));
        
        await toggleAdminTaskAction(taskId, isCompleted, type);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading dashboard data...</p>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Students",
            value: data?.stats?.totalStudents?.toLocaleString() || "0",
            change: `${data?.stats?.studentsChange >= 0 ? '+' : ''}${data?.stats?.studentsChange || 0}%`,
            trend: (data?.stats?.studentsChange >= 0) ? "up" : "down",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Active Subscriptions",
            value: data?.stats?.activeSubscriptions?.toLocaleString() || "0",
            change: `${data?.stats?.subsChange >= 0 ? '+' : ''}${data?.stats?.subsChange || 0}%`,
            trend: (data?.stats?.subsChange >= 0) ? "up" : "down",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            label: "Monthly Revenue",
            value: data?.stats?.monthlyRevenue || "₹0",
            change: `${data?.stats?.revenueChange >= 0 ? '+' : ''}${data?.stats?.revenueChange || 0}%`,
            trend: (data?.stats?.revenueChange >= 0) ? "up" : "down",
            icon: DollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            label: "Support Tickets",
            value: data?.stats?.supportTickets?.toLocaleString() || "0",
            change: `${data?.stats?.ticketsChange >= 0 ? '+' : ''}${data?.stats?.ticketsChange || 0}%`,
            trend: (data?.stats?.ticketsChange >= 0) ? "up" : "down",
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
    ];

    const recentActivity = data?.recentActivity || [];
    const pendingTasks = data?.pendingTasks || [];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
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
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity: any, index: number) => (
                                <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                                        <p className="text-sm text-slate-500">{activity.user}</p>
                                    </div>
                                    <span className="text-xs text-slate-400">{activity.time}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 py-4 text-center">No recent activity found.</p>
                        )}
                    </div>
                </Card>

                {/* Pending Tasks */}
                <Card className="p-6 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Pending Tasks</h3>
                    <div className="space-y-3">
                        {pendingTasks.length > 0 ? (
                            pendingTasks.map((item: any, index: number) => {
                                const isTicket = item.type === 'support_ticket';
                                return (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        {!isTicket ? (
                                            <input 
                                                type="checkbox" 
                                                onChange={(e) => handleTaskToggle(item.id, e.target.checked, item.type)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                            />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                                                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
                                            </div>
                                        )}
                                        
                                        {isTicket ? (
                                            <span className="flex-1 text-sm text-slate-900 font-medium">
                                                {item.task}
                                            </span>
                                        ) : (
                                            <span className="flex-1 text-sm text-slate-900">{item.task}</span>
                                        )}

                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            item.priority === "high" ? "bg-red-100 text-red-600" :
                                            item.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                                            "bg-green-100 text-green-600"
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-slate-500 py-4 text-center">No pending tasks!</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
