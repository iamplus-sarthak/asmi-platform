"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, BedDouble, Building, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface InstituteDetailTabProps {
    institute: any;
}

export function InstituteDetailTab({ institute }: InstituteDetailTabProps) {
    const router = useRouter();
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full overflow-hidden shrink-0 group">
                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4 z-20">
                    <Button 
                        onClick={() => router.push("/dashboard/institutes")}
                        variant="secondary" 
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 font-semibold rounded-xl shadow-md flex items-center gap-2 border border-slate-200/50 h-10 px-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <ArrowLeft className="h-4 w-4 text-blue-600" />
                        Back to Institutes
                    </Button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={institute.img || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80"}
                    alt={institute.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto flex items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="h-28 w-28 bg-white rounded-2xl p-2 shadow-2xl shrink-0 -mb-12 relative z-10">
                            <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                <span className="font-bold text-slate-400">LOGO</span>
                            </div>
                        </div>
                        <div className="text-white pb-2">
                            <h1 className="text-4xl font-bold mb-2 shadow-sm">{institute.name}</h1>
                            <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-white">
                                    {institute.type}
                                </span>
                                <span className="flex items-center gap-1.5 align-middle">
                                    <MapPin className="h-4 w-4" /> {institute.city}, India
                                </span>
                                <span>•</span>
                                <span>Affiliated to MUHS, Nashik</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-2">
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none">
                            <Globe className="mr-2 h-4 w-4" /> Website
                        </Button>
                        <Button variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md">
                            View Gallery <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-hidden flex flex-col pt-16">
                {/* Navigation Tabs */}
                <div className="border-b border-slate-200 sticky top-0 bg-white z-10 px-8">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        {["Overview", "Closing Ranks", "Fee & More", "Contact Details", "Accommodation", "Clinical Info"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`pb-4 text-sm font-medium transition-colors border-b-2 ${i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto p-8 space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { label: "Seats", value: "132", icon: UserIcon },
                                { label: "Management", value: "Central Govt", icon: Building },
                                { label: "Beds", value: "3194", icon: BedDouble },
                                { label: "Est. Year", value: "1956", icon: CheckCircle2 }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                                        <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Content Layout */}
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-8">
                                <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        About Institute
                                    </h3>
                                    <div className="prose prose-slate max-w-none text-slate-600">
                                        <p>
                                            The All India Institute of Medical Sciences (AIIMS) New Delhi is a public hospital and medical research university based in New Delhi, India. The institute governs itself under the AIIMS Act, 1956. AIIMS New Delhi was ranked 123rd in the world in the 2023 QS World University Rankings in the field of Medicine.
                                        </p>
                                        <p className="mt-4">
                                            It operates autonomously under the Ministry of Health and Family Welfare. AIIMS is a dream institution for every medical aspirant in the country.
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        Bond & Stipend Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-slate-900">Service Bond</h4>
                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Penalty Amount</span>
                                                    <span className="font-bold text-slate-900">₹ 3,00,000</span>
                                                </div>
                                                <Separator className="bg-blue-200" />
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Service Period</span>
                                                    <span className="font-bold text-slate-900">1 Year</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-slate-900">Internship Stipend</h4>
                                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Monthly Amount</span>
                                                    <span className="font-bold text-slate-900">₹ 26,300</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-4">Location</h4>
                                    <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 text-sm">
                                        Map View
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Ansari Nagar, New Delhi - 110029
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
