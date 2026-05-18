"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchFromAPI } from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, ArrowRight, Sparkles, ShieldCheck, User, Mail, MapPin, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// Form Schemas
const loginSchema = z.object({
    mobile: z.string().min(10, "Valid mobile number is required"),
});

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    state: z.string().min(1, "Please select your state"),
    exam: z.string().min(1, "Please select your target exam"),
    currentClass: z.string().min(1, "Please select your class"),
});

type Step = "MOBILE" | "OTP" | "PROFILE";

export default function LoginPage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [step, setStep] = useState<Step>("MOBILE");
    const [isLoading, setIsLoading] = useState(false);
    const [otpValue, setOtpValue] = useState("");

    // Login Form
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { mobile: "" },
    });

    // Profile Form
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            email: "",
            state: "",
            exam: "",
            currentClass: "",
        },
    });

    const onMobileSubmit = async (data: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            await fetchFromAPI('/api/users/send-otp', {
                method: 'POST',
                body: JSON.stringify({ mobile: data.mobile })
            });
            setStep("OTP");
        } catch (error) {
            alert('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (otpValue.length !== 4) return alert('Enter full OTP');
        setIsLoading(true);
        try {
            const data = await fetchFromAPI('/api/users/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ mobile: loginForm.getValues().mobile, otp: otpValue })
            });
            setUser(data.user);
            localStorage.setItem('payload-token', data.token);
            if (data.isNewUser) {
                setStep("PROFILE");
            } else {
                router.replace("/dashboard");
            }
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
        if (!user) return alert('Session expired');
        setIsLoading(true);
        try {
            const token = localStorage.getItem('payload-token');
            const headers: Record<string, string> = token ? { 'Authorization': `JWT ${token}` } : {};

            const studentRes = await fetchFromAPI('/api/students', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    full_name: data.fullName,
                    email: data.email,
                    phone_number: loginForm.getValues().mobile,
                    current_class: data.currentClass,
                    user_id: user.id
                })
            });

            await fetchFromAPI(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    onboarding_completed: true,
                    entity_id: {
                        relationTo: 'students',
                        value: studentRes.doc?.id
                    }
                })
            });

            setUser({ ...user, onboarding_completed: true });
            router.replace("/dashboard");
        } catch (error) {
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#020817] text-white selection:bg-blue-500/30">
            {/* Left Section - Hero/Branding */}
            <div className="hidden lg:flex w-[60%] flex-col justify-between p-16 relative overflow-hidden">
                {/* Abstract Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="z-10 relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-400 font-sans">
                            Asmi
                        </span>
                    </div>

                    <h1 className="text-6xl font-bold leading-tight mb-8 font-sans tracking-tight">
                        Your Gateway to <br />
                        <span className="text-blue-400">Academic Excellence</span>
                    </h1>

                    <div className="space-y-8 max-w-xl">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/10 cursor-default">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <ShieldCheck className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-100 mb-1">Authentic Data</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Access verified cut-offs, fee structures, and allotment data directly from official sources.
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-slate-400 leading-relaxed pl-2 border-l-2 border-blue-500/50">
                            "Seamlessly navigate your entire admission journey with our comprehensive counselling tools and expert insights."
                        </p>
                    </div>
                </div>

                <div className="z-10 text-sm text-slate-500 relative">
                    © 2025 Asmi Platform. All rights reserved.
                </div>
            </div>

            {/* Right Section - Main Content */}
            <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-slate-50 border-l border-slate-100 relative">
                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className={cn("w-full z-10 transition-all duration-500 ease-in-out", step === "PROFILE" ? "max-w-xl" : "max-w-md")}>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                            {step === "MOBILE" && "Welcome Back"}
                            {step === "OTP" && "Enter OTP"}
                            {step === "PROFILE" && "Complete Profile"}
                        </h2>
                        <p className="text-slate-500">
                            {step === "MOBILE" && "Please enter your mobile details to sign in."}
                            {step === "OTP" && "Enter the verification code sent to your device."}
                            {step === "PROFILE" && "Tell us a bit about yourself to personalize your experience."}
                        </p>
                    </div>

                    {step === "MOBILE" && (
                        <Form {...loginForm}>
                            <form
                                onSubmit={loginForm.handleSubmit(onMobileSubmit)}
                                className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
                            >
                                <div className="flex gap-4 items-start">
                                    <div className="w-[110px] flex-shrink-0">
                                        <Select defaultValue="+91">
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20 focus:border-blue-500 px-4 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🇮🇳</span>
                                                    <span className="font-semibold">+91</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormField
                                        control={loginForm.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mobile Number"
                                                        type="tel"
                                                        className="h-14 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white text-lg font-medium shadow-lg shadow-blue-600/20 transition-all rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-xl group"
                                    disabled={isLoading}
                                >
                                    WhatsApp Verification
                                </Button>
                            </form>
                        </Form>
                    )}

                    {step === "OTP" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={4}
                                    value={otpValue}
                                    onChange={setOtpValue}
                                >
                                    <InputOTPGroup className="gap-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="h-16 w-14 rounded-lg bg-slate-50 border-slate-200 text-slate-900 text-2xl focus:ring-blue-500 focus:border-blue-500 transition-all ring-offset-white"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={verifyOTP}
                                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-medium shadow-lg shadow-blue-500/20 transition-all rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Verify & Login <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => setStep("MOBILE")}
                                    className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                >
                                    I entered the wrong number
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "PROFILE" && (
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700">Full Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                                        <Input
                                                            placeholder="John Doe"
                                                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                                        <Input
                                                            placeholder="john@example.com"
                                                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={profileForm.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700">State of Residence</FormLabel>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 focus:ring-blue-500/20 focus:border-blue-500">
                                                            <SelectValue placeholder="Select your state" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                                        <SelectItem value="delhi">Delhi</SelectItem>
                                                        <SelectItem value="karnataka">Karnataka</SelectItem>
                                                        <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="exam"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700">Target Exam</FormLabel>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 focus:ring-blue-500/20 focus:border-blue-500">
                                                                <SelectValue placeholder="Select Exam" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                            <SelectItem value="neet-ug">NEET UG</SelectItem>
                                                            <SelectItem value="jee-main">JEE Main</SelectItem>
                                                            <SelectItem value="jee-adv">JEE Advanced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="currentClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700">Current Class</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-11 focus:ring-blue-500/20 focus:border-blue-500">
                                                            <SelectValue placeholder="Select Class" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                        <SelectItem value="11">11th Standard</SelectItem>
                                                        <SelectItem value="12">12th Standard</SelectItem>
                                                        <SelectItem value="dropper">Dropper</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-medium shadow-xl shadow-blue-600/20 rounded-xl transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            "Complete Profile & Continue"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}
