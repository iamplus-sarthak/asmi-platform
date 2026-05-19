"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, Gift, FileText, ChevronDown, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDrawer } from "@/components/dashboard/NotificationDrawer";
import { useAuthStore } from "@/store/useAuthStore";
import { getStudentProfileAction } from "@/actions/profile";

export function TopNav() {
    const router = useRouter();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuthStore();
    const [userInitial, setUserInitial] = useState("U");

    React.useEffect(() => {
        const fetchStudentName = async () => {
            if (!user?.id) return;
            try {
                const res = await getStudentProfileAction(user.id);
                
                if (res?.student && res.student.full_name) {
                    setUserInitial(res.student.full_name.charAt(0).toUpperCase());
                } else if (user.phone_number) {
                    setUserInitial(user.phone_number.charAt(0));
                }
            } catch (error) {
                console.error("Failed to fetch student for avatar:", error);
            }
        };

        fetchStudentName();
    }, [user]);

    return (
        <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-[260px] right-0 z-30">

            {/* Left: Exam Selector & Search */}
            <div className="flex items-center gap-6 flex-1 max-w-3xl">
                <div className="w-[180px]">
                    <Select defaultValue="neet-ug">
                        <SelectTrigger className="h-9 bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-300 focus:ring-blue-100 rounded-lg transition-all">
                            <span className="font-semibold text-blue-600 mr-1">NEET UG</span>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-700 shadow-lg">
                            <SelectItem value="neet-ug">NEET UG</SelectItem>
                            <SelectItem value="jee-main">JEE Main</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search for institutes, exams, or news..."
                        className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 rounded-full text-sm text-slate-700 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">

                <Button 
                    variant="ghost" 
                    onClick={() => router.push("/dashboard/blogs-news")}
                    className="h-9 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium hidden lg:flex transition-colors"
                >
                    <Newspaper className="mr-2 h-4 w-4" />
                    Blogs & News
                </Button>

                <Button variant="ghost" className="h-9 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium hidden lg:flex transition-colors">
                    <Gift className="mr-2 h-4 w-4" />
                    Refer & Earn
                </Button>

                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 font-medium">
                    Get a Package
                </Button>

                <div className="h-6 w-px bg-slate-200 mx-2" />

                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsNotificationOpen(true)}
                    className="h-9 w-9 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors relative"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full animate-bounce" />
                    )}
                </Button>

                <div 
                    onClick={() => router.push("/dashboard/profile")}
                    className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer border-2 border-white ring-2 ring-slate-100 hover:scale-105 active:scale-95 transition-all select-none uppercase"
                >
                    {userInitial}
                </div>
            </div>

            {/* Slide-out Notification Drawer */}
            <NotificationDrawer 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
                onUnreadChange={setUnreadCount}
            />
        </div>
    );
}
