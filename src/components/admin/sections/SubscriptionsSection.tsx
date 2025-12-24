"use client";

import React from "react";
import { Plus, Tag, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SubscriptionsSection() {
    const packages = [
        { id: 1, name: "Basic", price: "₹499", duration: "1 Month", active: 234, revenue: "₹1,16,766" },
        { id: 2, name: "Pro", price: "₹1,999", duration: "6 Months", active: 456, revenue: "₹9,11,544" },
        { id: 3, name: "Premium", price: "₹2,999", duration: "1 Year", active: 189, revenue: "₹5,66,811" },
    ];

    const promoCodes = [
        { code: "NEET2025", discount: "20%", used: 45, limit: 100, status: "Active" },
        { code: "FIRSTTIME", discount: "₹500", used: 123, limit: 500, status: "Active" },
        { code: "SUMMER50", discount: "50%", used: 89, limit: 200, status: "Expired" },
    ];

    const recentTransactions = [
        { id: "TXN001", user: "Rahul Sharma", package: "Pro", amount: "₹1,999", date: "2 hours ago", status: "Success" },
        { id: "TXN002", user: "Priya Patel", package: "Basic", amount: "₹499", date: "5 hours ago", status: "Success" },
        { id: "TXN003", user: "Amit Kumar", package: "Premium", amount: "₹2,999", date: "1 day ago", status: "Success" },
        { id: "TXN004", user: "Sneha Singh", package: "Pro", amount: "₹1,999", date: "1 day ago", status: "Failed" },
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
                    <p className="text-slate-500 mt-1">Manage packages, promo codes, and revenue</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Package
                </Button>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-slate-900">₹15,95,121</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Active Subscriptions</p>
                            <h3 className="text-2xl font-bold text-slate-900">879</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Tag className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Promo Codes Used</p>
                            <h3 className="text-2xl font-bold text-slate-900">257</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="packages">
                <TabsList>
                    <TabsTrigger value="packages">Packages</TabsTrigger>
                    <TabsTrigger value="promo">Promo Codes</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="packages" className="mt-6">
                    <Card className="p-6 border-slate-200">
                        <div className="space-y-4">
                            {packages.map((pkg) => (
                                <div key={pkg.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{pkg.name}</h4>
                                            <p className="text-sm text-slate-500">{pkg.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-sm text-slate-500">Price</p>
                                            <p className="font-semibold text-slate-900">{pkg.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Active Users</p>
                                            <p className="font-semibold text-slate-900">{pkg.active}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Revenue</p>
                                            <p className="font-semibold text-green-600">{pkg.revenue}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="promo" className="mt-6">
                    <Card className="p-6 border-slate-200">
                        <div className="flex justify-end mb-4">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Promo Code
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Code</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Discount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Usage</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promoCodes.map((promo, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-mono font-semibold text-slate-900">{promo.code}</td>
                                            <td className="py-3 px-4 text-sm text-slate-900">{promo.discount}</td>
                                            <td className="py-3 px-4 text-sm text-slate-600">{promo.used} / {promo.limit}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${promo.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                    }`}>
                                                    {promo.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions" className="mt-6">
                    <Card className="p-6 border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Transaction ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">User</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Package</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((txn) => (
                                        <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-mono text-sm text-slate-900">{txn.id}</td>
                                            <td className="py-3 px-4 text-sm text-slate-900">{txn.user}</td>
                                            <td className="py-3 px-4 text-sm text-slate-600">{txn.package}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-slate-900">{txn.amount}</td>
                                            <td className="py-3 px-4 text-sm text-slate-500">{txn.date}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${txn.status === "Success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                    }`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
