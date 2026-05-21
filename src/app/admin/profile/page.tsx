"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, ShieldCheck, LogOut, ArrowRight, Activity, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutUser } from "@/app/auth/actions";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminProfilePage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            router.push("/auth/login");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Not authenticated</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                            <User className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-7 w-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Profile</h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                            Manage your administrative account
                        </p>
                    </div>
                </div>
                
                <Button 
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white shadow-sm font-semibold h-11 px-6 rounded-xl transition-all"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Sign Out Securely"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-800">Account Details</CardTitle>
                                    <CardDescription className="text-sm font-medium mt-1">
                                        Your core identity and contact information
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        Primary Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <Input
                                            value={user.phone_number || "Not provided"}
                                            readOnly
                                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus-visible:ring-0 focus-visible:border-slate-200 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium ml-1">Phone number is your primary identifier.</p>
                                </div>

                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        Account Role
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ShieldCheck className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <Input
                                            value="Administrator"
                                            readOnly
                                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 text-slate-900 font-medium rounded-xl focus-visible:ring-0 focus-visible:border-slate-200 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-indigo-500" /> System Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Active Session</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Your admin session is securely authenticated.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Last Login</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        {(user as any).last_login_at ? new Date((user as any).last_login_at).toLocaleString() : 'Currently logged in'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
