"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, MapPin, Award, ShieldCheck, Check, Sparkles, Lock, ArrowRight, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutUser } from "@/app/auth/actions";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchFromAPI } from "@/lib/api-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Zod Validation Schema matching Onboarding Registration Schema exactly
const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid mobile number is required"),
    state: z.string().min(1, "Please select your state of residence"),
    exam: z.string().min(1, "Please select your target exam"),
    currentClass: z.string().min(1, "Please select your current class"),
});

export function ProfileTab() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
    const [student, setStudent] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const { user, setUser, isLoading: isAuthLoading } = useAuthStore();

    React.useEffect(() => {
        const fetchStudentProfile = async () => {
            if (isAuthLoading) return;
            if (!user?.id) {
                setIsLoadingProfile(false);
                return;
            }
            setIsLoadingProfile(true);
            try {
                const token = localStorage.getItem("payload-token");
                const headers: Record<string, string> = token ? { "Authorization": `JWT ${token}` } : {};

                // Query students collection directly where user_id equals current user.id
                const res = await fetchFromAPI(`/api/students?where[user_id][equals]=${user.id}`, {
                    headers,
                });

                if (res?.docs && res.docs.length > 0) {
                    setStudent(res.docs[0]);
                }
            } catch (error) {
                console.error("Failed to fetch student profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchStudentProfile();
    }, [user, isAuthLoading]);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            router.push("/auth/login");
        }
    };

    // Initialize React Hook Form with Zod Resolver
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            state: "maharashtra",
            exam: "neet-ug",
            currentClass: "12",
        },
    });

    // Reset form dynamically when student profile is loaded from backend
    React.useEffect(() => {
        if (student) {
            form.reset({
                fullName: student.full_name || "",
                email: student.email || "",
                phone: student.phone_number || user?.phone_number || "",
                state: student.state_id?.slug || student.state_id || "maharashtra",
                exam: student.prefferd_exam_id?.slug || student.prefferd_exam_id || "neet-ug",
                currentClass: student.current_class || "12",
            });
        }
    }, [student, user, form]);

    // Form onSubmit Handler - updates backend PostgreSQL database live!
    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        if (!student?.id) return;
        setIsSaving(true);
        setSaveStatus("idle");
        
        try {
            const token = localStorage.getItem("payload-token");
            const headers: Record<string, string> = token ? { "Authorization": `JWT ${token}` } : {};

            const updatedStudent = await fetchFromAPI(`/api/students/${student.id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    full_name: data.fullName,
                    email: data.email,
                    phone_number: data.phone,
                    current_class: data.currentClass,
                }),
            });

            if (updatedStudent?.doc) {
                // Update local auth store state dynamically
                setUser({
                    ...user!,
                    entity_id: updatedStudent.doc,
                });
            }

            setIsSaving(false);
            setSaveStatus("saved");
            setTimeout(() => {
                setSaveStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to save changes. Please try again.");
            setIsSaving(false);
        }
    };

    // Watched fields for dynamic profile header updates
    const watchedName = form.watch("fullName");
    const watchedEmail = form.watch("email");
    const watchedState = form.watch("state");
    const watchedExam = form.watch("exam");
    const watchedClass = form.watch("currentClass");

    const getExamLabel = (val: string) => {
        if (val === "neet-ug") return "NEET UG Candidate";
        if (val === "jee-main") return "JEE Main Candidate";
        if (val === "jee-adv") return "JEE Advanced Candidate";
        return "Student Candidate";
    };

    const getStateLabel = (val: string) => {
        if (val === "maharashtra") return "Maharashtra";
        if (val === "delhi") return "Delhi";
        if (val === "karnataka") return "Karnataka";
        if (val === "tamilnadu") return "Tamil Nadu";
        return val ? val.charAt(0).toUpperCase() + val.slice(1) : "";
    };

    const getClassLabel = (val: string) => {
        if (val === "11") return "11th Standard";
        if (val === "12") return "12th Standard";
        if (val === "dropper") return "Dropper";
        return val || "";
    };

    if (isLoadingProfile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 animate-in fade-in duration-300">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Loading your profile from database...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <User className="h-8 w-8 text-blue-600" />
                    My Profile
                </h1>
                <p className="text-slate-500">Manage your academic details, target exams, and personal eligibility parameters.</p>
            </div>

            {/* Profile Overview Card (Solid Style) */}
            <div className="relative overflow-hidden bg-blue-600 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row items-center gap-6">

                {/* Avatar */}
                <div className="h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold shadow-inner uppercase">
                    {watchedName ? watchedName.charAt(0) : "S"}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                        <h2 className="text-2xl font-bold">{watchedName || "Student Name"}</h2>
                        <span className="bg-white/20 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-yellow-300" /> {getExamLabel(watchedExam)}
                        </span>
                    </div>
                    <p className="text-blue-100/90 text-sm flex items-center justify-center md:justify-start gap-2">
                        <Mail className="h-4 w-4" /> {watchedEmail || "email@example.com"}
                    </p>
                    <p className="text-blue-100/90 text-sm flex items-center justify-center md:justify-start gap-2">
                        <MapPin className="h-4 w-4" /> State Eligibility: {getStateLabel(watchedState)}
                    </p>
                </div>

                {/* Target Exam Highlight Badge */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[150px] shadow-sm">
                    <p className="text-xs text-blue-100/80 font-medium uppercase tracking-wider">Target Exam</p>
                    <p className="text-2xl font-black mt-1 text-yellow-300">
                        {watchedExam === "neet-ug" ? "NEET UG" : watchedExam === "jee-main" ? "JEE Main" : watchedExam === "jee-adv" ? "JEE Adv" : "Not Selected"}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">Class: {getClassLabel(watchedClass)}</p>
                </div>
            </div>

            {/* Form Wrapper */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Column (Form Cards) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Reusable UI Component: Shadcn Card for Academic Settings */}
                        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-blue-600" />
                                    Academic & Exam Settings
                                </CardTitle>
                                <CardDescription>Configure your target exams, standard, and eligibility states.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="exam"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Exam</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-100">
                                                            <SelectValue placeholder="Select Exam" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-700">
                                                        <SelectItem value="neet-ug">NEET UG</SelectItem>
                                                        <SelectItem value="jee-main">JEE Main</SelectItem>
                                                        <SelectItem value="jee-adv">JEE Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currentClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Class</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-100">
                                                            <SelectValue placeholder="Select Class" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-700">
                                                        <SelectItem value="11">11th Standard</SelectItem>
                                                        <SelectItem value="12">12th Standard</SelectItem>
                                                        <SelectItem value="dropper">Dropper</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State of Residence</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-100">
                                                            <SelectValue placeholder="Select State" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-700">
                                                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                                        <SelectItem value="delhi">Delhi</SelectItem>
                                                        <SelectItem value="karnataka">Karnataka</SelectItem>
                                                        <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reusable UI Component: Shadcn Card for Personal Details */}
                        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    Personal Account Information
                                </CardTitle>
                                <CardDescription>Update your contact info and login authentication variables.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="email"
                                                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Mobile Number</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input 
                                                            className="pl-9 h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                                                            {...field} 
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => form.reset()}
                                className="h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50"
                            >
                                Reset Changes
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : saveStatus === "saved" ? (
                                    <>
                                        <Check className="h-4 w-4" /> Details Saved!
                                    </>
                                ) : (
                                    "Save Profile Details"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column (Subscription & Recommendations Side Card) */}
                    <div className="space-y-6">
                        
                        {/* Reusable UI Component: Shadcn Card for Subscription */}
                        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Current Subscription
                                </CardTitle>
                                <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5 mt-1">
                                    Free Account
                                    <Badge variant="secondary" className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                                        Default
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* List of features locked */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <Lock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                        <span>Advanced Closing Ranks analysis (Round 2, 3 & Stray)</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <Lock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                        <span>Detailed Stipend, Fee & Bond penalty calculations</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <Lock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                        <span>Unlimited Rank Scan lookups</span>
                                    </div>
                                </div>

                                {/* Upgrade CTA */}
                                <div className="pt-2">
                                    <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 group">
                                        Upgrade to Premium
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Recommendation Card */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
                            <p className="font-bold flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                Target Exam Recommendation
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Your class **{getClassLabel(watchedClass)}** eligibility parameters are being used dynamically to personalize all dashboard recommendations tailored specifically for you!
                            </p>
                        </div>

                        {/* Account Actions / Danger Zone Card */}
                        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                                    Account Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <Button
                                    type="button"
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/50 border-red-100 hover:border-red-200 font-semibold h-11 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />
                                    Logout of Account
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Form>
        </div>
    );
}
