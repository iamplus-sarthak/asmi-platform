"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PackagePlan {
    name: string;
    price: string;
    originalPrice?: string;
    period: string;
    description: string;
    features: string[];
    isPopular: boolean;
    badge?: string;
    buttonText: string;
    buttonVariant: "default" | "outline" | "secondary";
}

interface PricingCardProps {
    plan: PackagePlan;
}

export function PricingCard({ plan }: PricingCardProps) {
    return (
        <div
            className={`relative rounded-3xl bg-white border p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                    : "border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300"
            }`}
        >
            {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                </span>
            )}

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
                    <p className="text-sm text-slate-400 mt-2 min-h-[40px]">
                        {plan.description}
                    </p>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                    <span className="text-4xl font-extrabold text-slate-950">
                        {plan.price}
                    </span>
                    {plan.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                            {plan.originalPrice}
                        </span>
                    )}
                    <span className="text-sm font-semibold text-slate-400">
                        / {plan.period}
                    </span>
                </div>

                <ul className="space-y-3.5">
                    {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm text-slate-600 font-medium">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <Button
                    variant={plan.buttonVariant}
                    className={`w-full h-11 rounded-2xl font-semibold shadow-sm transition-all duration-300 ${
                        plan.isPopular
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                            : "hover:scale-[1.01]"
                    }`}
                >
                    {plan.buttonText}
                </Button>
            </div>
        </div>
    );
}
