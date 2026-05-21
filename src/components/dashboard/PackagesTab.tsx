"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { PricingCard, PackagePlan } from "@/components/dashboard/PricingCard";
import { getDocsAction } from "@/actions/admin-crud";

export function PackagesTab() {
    const [plans, setPlans] = useState<PackagePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await getDocsAction({ 
                    collection: "subscription_plans",
                    query: { is_active: { equals: true } },
                    limit: 10
                });

                if (res.success && res.data?.docs) {
                    const mappedPlans: PackagePlan[] = res.data.docs.map((p: any, idx: number) => {
                        // Extract features from description by splitting newlines, or default to some basic features
                        let featuresList = ["Full Portal Access", "Email Support"];
                        if (p.description) {
                            featuresList = p.description.split('\n').map((line: string) => line.trim()).filter(Boolean);
                        }

                        // Just a logic to make one of them popular for UI aesthetics (e.g. the second one)
                        const isPopular = idx === 1;

                        return {
                            name: p.name,
                            price: `₹${p.price}`,
                            period: p.duration_days === 365 ? "per year" : (p.duration_days === 30 ? "per month" : `${p.duration_days} days`),
                            description: p.description?.substring(0, 100) + "..." || "Access the premium features.",
                            features: featuresList,
                            isPopular: isPopular,
                            badge: isPopular ? "Most Popular" : undefined,
                            buttonText: p.price === 0 ? "Current Plan" : "Upgrade Plan",
                            buttonVariant: p.price === 0 ? "outline" : (isPopular ? "default" : "secondary"),
                        };
                    });

                    // Sort by price ascending to keep free/cheaper plans first
                    mappedPlans.sort((a, b) => {
                        const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
                        const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
                        return priceA - priceB;
                    });

                    setPlans(mappedPlans);
                }
            } catch (err) {
                console.error("Failed to load subscription plans:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-semibold text-lg animate-pulse">Loading packages...</p>
            </div>
        );
    }

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Simple & Transparent Pricing
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Choose the Perfect Counselling Package
                </h1>
                <p className="text-lg text-slate-500">
                    Empower your medical career decisions with our premium analytics tools and expert counselling.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        No active packages available right now.
                    </div>
                )}
            </div>
        </div>
    );
}
