"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { PricingCard, PackagePlan } from "@/components/dashboard/PricingCard";

const plans: PackagePlan[] = [
    {
        name: "Starter",
        price: "₹0",
        period: "Free forever",
        description: "Explore medical colleges and access basic counselling guidelines.",
        features: [
            "Access to Basic Seat Matrix",
            "State & Central Institute Search",
            "Public Blogs & Latest News",
            "General counselling FAQs",
        ],
        isPopular: false,
        buttonText: "Current Plan",
        buttonVariant: "outline",
    },
    {
        name: "Pro Premium",
        price: "₹4,999",
        originalPrice: "₹9,999",
        period: "per year",
        description: "Unlock powerful analytics and rank prediction tools to optimize your college choices.",
        features: [
            "Advanced Rank Scan Tool",
            "Dynamic Allotment Mapping",
            "Fee, Stipend & Bond Calculator",
            "Detailed Cutoff Analytics (All Rounds)",
            "College Comparison Tool",
            "Email notifications & updates",
        ],
        isPopular: true,
        badge: "Most Popular",
        buttonText: "Upgrade to Pro",
        buttonVariant: "default",
    },
    {
        name: "Elite Mentorship",
        price: "₹14,999",
        originalPrice: "₹24,999",
        period: "per year",
        description: "Get personalized 1-on-1 expert support throughout your counselling journey.",
        features: [
            "Everything in Pro Premium",
            "Dedicated Personal Counsellor",
            "Customized Choice Filling List",
            "Instant SMS & WhatsApp Alerts",
            "Document Verification Assistance",
            "Unlimited Phone & Chat Support",
        ],
        isPopular: false,
        buttonText: "Enroll in Mentorship",
        buttonVariant: "secondary",
    },
];

export function PackagesTab() {
    const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
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
                {plans.map((plan) => (
                    <PricingCard key={plan.name} plan={plan} />
                ))}
            </div>
        </div>
    );
}
