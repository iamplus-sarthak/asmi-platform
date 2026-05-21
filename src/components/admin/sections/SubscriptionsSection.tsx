"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Tag, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDocsAction, createDocAction, updateDocAction } from "@/actions/admin-crud";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { SubscriptionPlanForm } from "@/components/admin/forms/SubscriptionPlanForm";
import { PromoCodeForm } from "@/components/admin/forms/PromoCodeForm";

export function SubscriptionsSection() {
    const [packages, setPackages] = useState<any[]>([]);
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    
    // Drawers State
    const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
    const [isPromoDrawerOpen, setIsPromoDrawerOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [plansRes, promoRes, txnRes, subsRes] = await Promise.all([
                getDocsAction({ collection: "subscription_plans", limit: 100 }),
                getDocsAction({ collection: "promo_codes", limit: 100 }),
                getDocsAction({ collection: "payments", limit: 100 }),
                getDocsAction({ collection: "user_subscriptions", limit: 1000 }),
            ]);

            if (plansRes.success) setPackages(plansRes.data?.docs || []);
            if (promoRes.success) setPromoCodes(promoRes.data?.docs || []);
            if (txnRes.success) setTransactions(txnRes.data?.docs || []);
            if (subsRes.success) setSubscriptions(subsRes.data?.docs || []);
        } catch (error) {
            console.error("Failed to fetch subscriptions data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePlanSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedPlan) {
                await updateDocAction({ collection: "subscription_plans", id: selectedPlan.id, data });
            } else {
                await createDocAction({ collection: "subscription_plans", data });
            }
            await fetchData();
            setIsPlanDrawerOpen(false);
            setSelectedPlan(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePromoSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedPromo) {
                await updateDocAction({ collection: "promo_codes", id: selectedPromo.id, data });
            } else {
                await createDocAction({ collection: "promo_codes", data });
            }
            await fetchData();
            setIsPromoDrawerOpen(false);
            setSelectedPromo(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreatePlan = () => {
        setSelectedPlan(null);
        setIsPlanDrawerOpen(true);
    };

    const openEditPlan = (pkg: any) => {
        setSelectedPlan(pkg);
        setIsPlanDrawerOpen(true);
    };

    const openCreatePromo = () => {
        setSelectedPromo(null);
        setIsPromoDrawerOpen(true);
    };

    const openEditPromo = (promo: any) => {
        setSelectedPromo(promo);
        setIsPromoDrawerOpen(true);
    };

    // Derived Metrics
    const totalRevenue = transactions.filter(t => t.status === 'success').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const activeSubs = subscriptions.filter(s => s.status === 'active').length;
    const promoCodesUsed = promoCodes.reduce((acc, curr) => acc + (curr.used_count || 0), 0);

    const getPackageMetrics = (pkgId: string | number) => {
        const activeUsers = subscriptions.filter(s => {
            const planId = typeof s.plan_id === 'object' ? s.plan_id?.id : s.plan_id;
            return planId === pkgId && s.status === 'active';
        }).length;

        const rev = transactions.filter(t => {
            const planId = typeof t.subscription_plan_id === 'object' ? t.subscription_plan_id?.id : t.subscription_plan_id;
            return planId === pkgId && t.status === 'success';
        }).reduce((acc, curr) => acc + (curr.amount || 0), 0);

        return { activeUsers, revenue: rev };
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Subscriptions</h1>
                    <p className="text-slate-500 mt-1">Manage packages, promo codes, and revenue</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreatePlan}>
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
                            <h3 className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
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
                            <h3 className="text-2xl font-bold text-slate-900">{activeSubs}</h3>
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
                            <h3 className="text-2xl font-bold text-slate-900">{promoCodesUsed}</h3>
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
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500 flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading packages...</div>
                        ) : packages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No packages found. Create one to get started.</div>
                        ) : (
                            <div className="space-y-4">
                                {packages.map((pkg) => {
                                    const metrics = getPackageMetrics(pkg.id);
                                    return (
                                        <div key={pkg.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                        {pkg.name}
                                                        {!pkg.is_active && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Inactive</span>}
                                                    </h4>
                                                    <p className="text-sm text-slate-500">{pkg.duration_days} Days</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div>
                                                    <p className="text-sm text-slate-500">Price</p>
                                                    <p className="font-semibold text-slate-900">₹{pkg.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Active Users</p>
                                                    <p className="font-semibold text-slate-900">{metrics.activeUsers}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Revenue</p>
                                                    <p className="font-semibold text-green-600">₹{metrics.revenue.toLocaleString('en-IN')}</p>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => openEditPlan(pkg)}>Edit</Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="promo" className="mt-6">
                    <Card className="p-6 border-slate-200">
                        <div className="flex justify-end mb-4">
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreatePromo}>
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
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin mx-auto"/></td></tr>
                                    ) : promoCodes.length === 0 ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-slate-500">No promo codes found.</td></tr>
                                    ) : promoCodes.map((promo) => {
                                        let statusStr = promo.is_active ? "Active" : "Inactive";
                                        if (promo.expiry_date && new Date(promo.expiry_date) < new Date()) {
                                            statusStr = "Expired";
                                        }

                                        return (
                                            <tr key={promo.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-900">{promo.code}</td>
                                                <td className="py-3 px-4 text-sm text-slate-900">
                                                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₹${promo.discount_value}`}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{promo.used_count || 0} / {promo.usage_limit || '∞'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStr === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                        {statusStr}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="outline" size="sm" onClick={() => openEditPromo(promo)}>Edit</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
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
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="py-8 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin mx-auto"/></td></tr>
                                    ) : transactions.length === 0 ? (
                                        <tr><td colSpan={6} className="py-8 text-center text-slate-500">No transactions found.</td></tr>
                                    ) : transactions.map((txn) => {
                                        const userObj = typeof txn.user_id === 'object' ? txn.user_id : null;
                                        const planObj = typeof txn.subscription_plan_id === 'object' ? txn.subscription_plan_id : null;
                                        
                                        return (
                                            <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 px-4 font-mono text-sm text-slate-900">{txn.order_id || txn.id}</td>
                                                <td className="py-3 px-4 text-sm text-slate-900">{userObj?.name || txn.user_id}</td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{planObj?.name || '-'}</td>
                                                <td className="py-3 px-4 text-sm font-semibold text-slate-900">₹{txn.amount}</td>
                                                <td className="py-3 px-4 text-sm text-slate-500">{new Date(txn.createdAt).toLocaleString()}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${txn.status === "success" ? "bg-green-100 text-green-600" : txn.status === "created" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                                                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <CrudDrawer
                open={isPlanDrawerOpen}
                onOpenChange={setIsPlanDrawerOpen}
                title={selectedPlan ? "Edit Package" : "Create Package"}
                description={selectedPlan ? "Update the subscription package details below." : "Add a new subscription package to your platform."}
            >
                <SubscriptionPlanForm
                    initialData={selectedPlan}
                    onSubmit={handlePlanSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>

            <CrudDrawer
                open={isPromoDrawerOpen}
                onOpenChange={setIsPromoDrawerOpen}
                title={selectedPromo ? "Edit Promo Code" : "Create Promo Code"}
                description={selectedPromo ? "Update promo code settings and limits." : "Create a new discount code for your users."}
            >
                <PromoCodeForm
                    initialData={selectedPromo}
                    onSubmit={handlePromoSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </div>
    );
}
