"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    type: "info" | "success" | "warning";
}

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadChange?: (count: number) => void;
}

export function NotificationDrawer({ isOpen, onClose, onUnreadChange }: NotificationDrawerProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { getDocsAction } = await import("@/actions/admin-crud");
                const res = await getDocsAction({
                    collection: "announcements",
                    query: { status: { equals: "published" } },
                    limit: 20
                });

                if (res.success && res.data?.docs) {
                    const mapped = res.data.docs.map((a: any) => {
                        let uiType: "info" | "success" | "warning" = "info";
                        if (a.announcement_type === "event") uiType = "success";
                        if (a.announcement_type === "quick") uiType = "warning";
                        
                        const dateObj = new Date(a.createdAt || new Date());

                        return {
                            id: a.id,
                            title: a.title,
                            description: a.message,
                            time: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            isRead: false,
                            type: uiType
                        };
                    });
                    
                    // Sort descending by date (though API should do it, ensuring here)
                    setNotifications(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch announcements:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

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

    const toggleRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
        );
    };

    return (
        <>
            {/* Sliding Drawer Container - Mathematical Layout to prevent collapsing */}
            <div
                className={cn(
                    "fixed right-0 top-16 w-[410px] max-w-full bg-slate-50 border-l border-slate-200 shadow-2xl z-20 transition-all duration-300 ease-in-out transform h-[calc(100vh-64px)] overflow-hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header - Solid White with Explicit Height (56px) */}
                <div className="h-[56px] border-b border-slate-200 flex items-center justify-between bg-white px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100/50">
                            <Bell className="h-4.5 w-4.5 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-[14px] tracking-tight leading-none">Notification Center</h3>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">Instant updates & status alerts</p>
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

                {/* List Body - Explicit Height calculated: 100% - 128px (Header + Footer) */}
                <div className="h-[calc(100%-128px)] overflow-y-auto p-3.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* Action Row */}
                    {notifications.length > 0 && (
                        <div className="flex items-center justify-between pb-0.5 px-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-blue-500" /> Personal Alerts
                            </span>
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline transition-all"
                            >
                                <Check className="h-3.5 w-3.5" /> Mark all as read
                            </button>
                        </div>
                    )}

                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-2 animate-in fade-in duration-300">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-1">
                                <Bell className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-700 text-sm">All caught up!</h4>
                            <p className="text-xs text-slate-400 max-w-[200px] font-medium leading-relaxed">
                                You have no unread personal notifications at this time.
                            </p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => toggleRead(n.id)}
                                className={cn(
                                    "relative p-3 rounded-lg border transition-all cursor-pointer group flex gap-2.5 animate-in fade-in duration-200",
                                    n.isRead
                                        ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                                        : "bg-blue-50/50 border-blue-200 hover:bg-blue-50/70 shadow-xs"
                                )}
                            >
                                {/* Status Dot */}
                                {!n.isRead && (
                                    <span className="absolute top-4 right-3 h-2 w-2 bg-blue-600 rounded-full" />
                                )}

                                {/* Icon Selector */}
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border",
                                    n.type === "success" && "bg-green-50 text-green-600 border-green-100",
                                    n.type === "warning" && "bg-amber-50 text-amber-600 border-amber-100",
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

                {/* Footer - Solid White CTA  */}
                <div className="h-[72px] border-t border-slate-200 bg-white flex flex-col justify-center p-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                        <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-slate-600 leading-snug">
                            Buy an <strong>Expert Counselling Package</strong> to receive instant WhatsApp alerts for all exam rounds!
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
