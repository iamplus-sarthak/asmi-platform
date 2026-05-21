"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    type: "info" | "success" | "warning";
    link?: string;
}

interface AdminNotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadChange?: (count: number) => void;
}

export function AdminNotificationDrawer({ isOpen, onClose, onUnreadChange }: AdminNotificationDrawerProps) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { getAdminNotificationsAction } = await import("@/actions/admin");
                const res = await getAdminNotificationsAction();

                if (res.success && res.data) {
                    setNotifications(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch admin notifications:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchNotifications();
        } else {
            // Also fetch on mount to get initial count
            fetchNotifications();
        }
    }, [isOpen]);

    // Calculate unread count and trigger callback
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    useEffect(() => {
        if (onUnreadChange) {
            onUnreadChange(unreadCount);
        }
    }, [unreadCount, onUnreadChange]);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const toggleRead = (id: string, link?: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        
        if (link) {
            router.push(link);
            onClose();
        }
    };

    return (
        <>
            {/* Sliding Drawer Container */}
            <div
                className={cn(
                    "fixed right-0 top-16 w-[410px] max-w-full bg-slate-50 border-l border-slate-200 shadow-2xl z-20 transition-all duration-300 ease-in-out transform h-[calc(100vh-64px)] overflow-hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-[56px] border-b border-slate-200 flex items-center justify-between bg-white px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100/50">
                            <Bell className="h-4.5 w-4.5 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-[14px] tracking-tight leading-none">Admin Alerts</h3>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">System & user updates</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-7 w-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* List Body */}
                <div className="h-[calc(100%-56px)] overflow-y-auto p-3.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* Action Row */}
                    {notifications.length > 0 && (
                        <div className="flex items-center justify-between pb-0.5 px-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-indigo-500" /> Recent Activity
                            </span>
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline transition-all"
                            >
                                <Check className="h-3.5 w-3.5" /> Mark all as read
                            </button>
                        </div>
                    )}

                    {notifications.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-2 animate-in fade-in duration-300">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-1">
                                <Check className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-700 text-sm">Inbox Zero!</h4>
                            <p className="text-xs text-slate-400 max-w-[200px] font-medium leading-relaxed">
                                You have no pending admin alerts at this time.
                            </p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => toggleRead(n.id, n.link)}
                                className={cn(
                                    "relative p-3 rounded-lg border transition-all cursor-pointer group flex gap-2.5 animate-in fade-in duration-200",
                                    n.isRead
                                        ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                                        : "bg-indigo-50/50 border-indigo-200 hover:bg-indigo-50/70 shadow-xs"
                                )}
                            >
                                {/* Status Dot */}
                                {!n.isRead && (
                                    <span className="absolute top-4 right-3 h-2 w-2 bg-indigo-600 rounded-full" />
                                )}

                                {/* Icon Selector */}
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border",
                                    n.type === "success" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                                    n.type === "warning" && "bg-rose-50 text-rose-600 border-rose-100",
                                    n.type === "info" && "bg-blue-50 text-blue-600 border-blue-100"
                                )}>
                                    {n.type === "success" && <Check className="h-4 w-4" />}
                                    {n.type === "warning" && <AlertCircle className="h-4 w-4" />}
                                    {n.type === "info" && <Bell className="h-4 w-4" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-0.5">
                                    <h4 className={cn("text-xs pr-4 tracking-tight leading-snug", n.isRead ? "font-semibold text-slate-700" : "font-extrabold text-slate-900")}>
                                        {n.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{n.description}</p>
                                    <div className="pt-1">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{n.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
