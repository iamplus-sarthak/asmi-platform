"use client";

import React, { useState } from "react";
import { 
    Calendar, 
    Clock, 
    User, 
    ArrowRight, 
    Newspaper, 
    X, 
    BookOpen, 
    ThumbsUp, 
    Share2, 
    Bookmark 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    category: "Counselling Guide" | "Admission Strategy" | "Documents Check" | "Latest News" | "Institute Insights";
    date: string;
    readTime: string;
    author: string;
    gradient: string;
    featured?: boolean;
}

const articlesData: Article[] = [
    {
        id: 1,
        title: "NEET UG 2026: Step-by-Step Choice Filling Strategy for MCC Round 1",
        description: "An in-depth guide on how to order your choices for the Medical Counselling Committee (MCC) Round 1 to secure your dream medical seat and avoid common pitfalls.",
        content: `
            Medical Counselling Committee (MCC) is set to start the Choice Filling process for NEET UG Round 1. This is the most crucial phase of your medical admission journey. One wrong choice order can lock you into an undesirable college, or worse, disqualify you from subsequent rounds.

            Here is our recommended choice filling strategy:
            
            1. **Analyze Previous Years' Closing Ranks**: Before listing choices, look at the round-wise closing ranks for 2024 and 2025. Be realistic about your options based on your current All India Rank (AIR).
            2. **Categorize Your Preferences**: Divide your choices into three groups:
               - **Dream Choices**: High-ranking colleges slightly above your rank range.
               - **Realistic Choices**: Quality colleges where your rank is well within the closing rank range.
               - **Safety Choices**: Good options where you are guaranteed a seat.
            3. **Order by Actual Priority**: Never fill colleges just because they are popular. Consider tuition fees, distance from home, service bonds, and hostel facilities.
            4. **Avoid Lock-in Errors**: Make sure to check if you are willing to join the college if allotted. In Round 1, free exit is available, but in subsequent rounds, non-joining leads to security deposit forfeiture.
            
            Always lock your choices on time. Keep monitoring notifications for any seat additions or changes in seat matrix.
        `,
        category: "Counselling Guide",
        date: "May 18, 2026",
        readTime: "8 min read",
        author: "Dr. A. K. Sharma (Counselling Expert)",
        gradient: "from-indigo-600 via-purple-600 to-pink-500",
        featured: true
    },
    {
        id: 2,
        title: "State Quota vs All India Quota: Which one should you prioritize?",
        description: "Understanding the difference between AIQ (15%) and State Quota (85%) seats and how to balance them in your overall admission strategy.",
        content: `
            Navigating the double-track admission system in India can be confusing. 15% of all government medical college seats are pooled under the All India Quota (AIQ) administered by MCC, while the remaining 85% seats are reserved for students belonging to the respective state (State Quota).

            **Key differences to consider:**
            - **Cutoffs**: AIQ cutoffs for prestigious national colleges are extremely high. State quota cutoffs are generally lower and offer better chances for local candidates.
            - **Bonds**: Different states have varying service bond conditions. AIQ seats still follow state-level bonds, so check the bond conditions before selecting.
            - **Counselling Schedules**: State counselling usually starts after MCC Round 1. It is critical to coordinate your seat acceptance. If you hold a seat in state quota, you might not be allowed to participate in further AIQ rounds.

            We recommend registering for both quotas. If you secure a decent college in AIQ Round 1, you can choose to upgrade it or look for better state government colleges in State Round 1.
        `,
        category: "Admission Strategy",
        date: "May 15, 2026",
        readTime: "5 min read",
        author: "Meera Deshmukh",
        gradient: "from-emerald-500 to-teal-600"
    },
    {
        id: 3,
        title: "List of Essential Documents Required for NEET 2026 Counselling Verification",
        description: "Don't lose your seat over missing paperwork! Here is the complete checklist of verified documents for central and state admissions.",
        content: `
            Document verification is the final gateway to your medical college. Every year, dozens of students lose their allotted seats simply because their certificates are out of date or missing.

            **Here is the essential checklist you must prepare today:**
            1. **NEET UG Admit Card 2026** (Make sure you have the signed copy)
            2. **NEET UG Scorecard / Rank Letter**
            3. **Class 10th Certificate & Mark Sheet** (For date of birth proof)
            4. **Class 12th Certificate & Mark Sheet**
            5. **Valid Government ID Proof** (Aadhaar Card, Passport, PAN Card, or Voter ID)
            6. **Eight Passport Size Photographs** (Must match the one uploaded on the NEET application form)
            7. **Provisional Allotment Letter** (Generated online after seat allocation)
            8. **Category Certificate** (OBC-NCL, SC, ST, EWS, if applicable - must be recently issued as per guidelines)
            9. **Domicile Certificate** (Mandatory for State Quota seats)

            Keep at least 3 sets of self-attested photocopies of all documents, along with original copies in a secure folder.
        `,
        category: "Documents Check",
        date: "May 12, 2026",
        readTime: "4 min read",
        author: "Rajesh Patil (Admin Head)",
        gradient: "from-orange-500 to-red-600"
    },
    {
        id: 4,
        title: "New Government Medical Colleges Approved for Academic Session 2026-27",
        description: "The National Medical Commission (NMC) has approved 15 new government medical colleges, adding over 1,500 MBBS seats to the seat pool.",
        content: `
            In a major boost to medical education in India, the National Medical Commission (NMC) has issued Letters of Permission (LoP) to 15 new government medical colleges across different states for the upcoming academic year. 

            This expansion adds 1,550 fresh MBBS seats to the seat matrix, which will significantly lower the cutoffs and benefit thousands of aspirants.

            **State-wise breakdown of new colleges:**
            - **Maharashtra**: 3 new colleges (adding 300 seats)
            - **Uttar Pradesh**: 4 new colleges (adding 400 seats)
            - **Rajasthan**: 3 new colleges (adding 300 seats)
            - **Madhya Pradesh**: 2 new colleges (adding 200 seats)
            - **Telangana & Andhra Pradesh**: 3 new colleges (adding 350 seats)

            These seats will be included in the seat matrix starting from MCC Round 1. Make sure to update your college list to include these newer colleges if you want a government seat at a slightly higher rank!
        `,
        category: "Latest News",
        date: "May 10, 2026",
        readTime: "6 min read",
        author: "Asmi News Desk",
        gradient: "from-cyan-500 to-blue-600"
    },
    {
        id: 5,
        title: "Understanding Bond Conditions, Fees, and Stipends of Top Institutes",
        description: "A comprehensive state-wise breakdown of service bonds, penalties, annual tuition fees, and monthly stipends across top government medical colleges.",
        content: `
            Before selecting a medical college, it is vital to check the post-MBBS bond criteria. Many states mandate that MBBS graduates serve in rural or state-run healthcare systems for a specific number of years. Non-compliance results in heavy financial penalties.

            **State-wise Bond Comparison (2025 Data):**
            - **Maharashtra**: 1-year rural service bond or ₹10 Lakhs penalty. Monthly stipend for interns is approx. ₹18,000.
            - **Uttar Pradesh**: 2-year service bond or ₹10 Lakhs penalty.
            - **Haryana**: Compulsory service bond with a higher penalty structure.
            - **Karnataka**: 1-year compulsory rural service. 

            **Annual Tuition Fee Range:**
            Government colleges tuition fees range from ₹5,000 per year (like Maulana Azad Medical College, Delhi) to ₹1.2 Lakhs per year (in states like Maharashtra and Gujarat). Make sure to evaluate these financials along with the college rankings before finalizing your preferences.
        `,
        category: "Institute Insights",
        date: "May 08, 2026",
        readTime: "7 min read",
        author: "Vikram Sen",
        gradient: "from-violet-500 to-pink-600"
    }
];

export function BlogsNewsTab() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const filteredArticles = articlesData;
    const featuredArticle = articlesData.find(a => a.featured) || articlesData[0];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                        <Newspaper className="h-8 w-8 text-blue-600" />
                        Blogs & Latest News
                    </h1>
                    <p className="text-slate-500 mt-1">Stay updated with the latest NEET UG counselling schedules, news, and expert admission guides.</p>
                </div>
            </div>

            {/* Featured Article Hero Card (Show only when searching is empty and Category is All) */}
            {featuredArticle && (
                <div 
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white group cursor-pointer"
                >
                    <div className="grid md:grid-cols-12 min-h-[400px]">
                        {/* Gradient visual banner */}
                        <div className={cn(
                            "md:col-span-5 bg-gradient-to-br flex flex-col justify-between p-8 text-white relative overflow-hidden",
                            featuredArticle.gradient
                        )}>
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="z-10 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 self-start text-xs font-bold uppercase tracking-wider">
                                Featured Article
                            </div>
                            <div className="z-10 space-y-4">
                                <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                                    {featuredArticle.category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                                    {featuredArticle.title}
                                </h2>
                            </div>
                        </div>

                        {/* Article Text Content */}
                        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {featuredArticle.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {featuredArticle.readTime}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {featuredArticle.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {featuredArticle.author.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{featuredArticle.author}</span>
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1.5 transition-transform duration-300">
                                    Read Full Article
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles Grid List */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">
                    All Articles & Updates
                </h2>


                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer group"
                            >
                                {/* Gradient header header */}
                                <div className={cn(
                                    "h-32 bg-gradient-to-br p-6 text-white flex flex-col justify-between relative",
                                    article.gradient
                                )}>
                                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider self-start">
                                        {article.category}
                                    </span>
                                    <span className="text-[10px] font-semibold flex items-center gap-1 opacity-90">
                                        <Clock className="h-3 w-3" />
                                        {article.readTime}
                                    </span>
                                </div>

                                {/* Body body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {article.date}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                                            {article.description}
                                        </p>
                                    </div>

                                    {/* Footer footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                                        <span className="font-semibold text-slate-500 truncate max-w-[150px]">{article.author}</span>
                                        <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform duration-300">
                                            Read
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>

            {/* Modal Detail Dialog View */}
            {selectedArticle && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        {/* Header banner */}
                        <div className={cn(
                            "relative bg-gradient-to-br p-8 text-white flex flex-col justify-between min-h-[160px]",
                            selectedArticle.gradient
                        )}>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="absolute right-4 top-4 bg-black/10 hover:bg-black/20 text-white p-2 rounded-full transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider self-start z-10">
                                {selectedArticle.category}
                            </span>
                            <div className="z-10 space-y-2 mt-4">
                                <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
                                    {selectedArticle.title}
                                </h2>
                                <div className="flex items-center gap-4 text-xs font-medium text-white/95">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {selectedArticle.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {selectedArticle.readTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content area */}
                        <ScrollArea className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <div className="space-y-6 text-slate-700 leading-relaxed text-sm md:text-base">
                                <p className="font-semibold text-slate-800 border-l-4 border-blue-500 pl-3 italic">
                                    {selectedArticle.description}
                                </p>
                                <div className="whitespace-pre-line text-slate-600">
                                    {selectedArticle.content}
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Footer details */}
                        <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 md:px-8 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm border border-blue-200">
                                    {selectedArticle.author.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">{selectedArticle.author}</span>
                                    <span className="text-[10px] text-slate-400 font-semibold">Published Author</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                                    <ThumbsUp className="h-4.5 w-4.5" />
                                </button>
                                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                                    <Share2 className="h-4.5 w-4.5" />
                                </button>
                                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                                    <Bookmark className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
