"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allotmentSchema, AllotmentFormValues } from "@/lib/validations/admin";
import { getDocsAction } from "@/actions/admin-crud";

interface AllotmentFormProps {
    initialData?: any | null;
    onSubmit: (data: AllotmentFormValues) => void;
    isSubmitting: boolean;
}

export function AllotmentForm({ initialData, onSubmit, isSubmitting }: AllotmentFormProps) {
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [instituteCourses, setInstituteCourses] = useState<any[]>([]);
    const [quotas, setQuotas] = useState<any[]>([]);
    const [admissionStatuses, setAdmissionStatuses] = useState<any[]>([]);

    const form = useForm<AllotmentFormValues>({
        resolver: zodResolver(allotmentSchema) as any,
        defaultValues: initialData || {
            year: "",
            round_no: 1,
            counselling_id: "",
            institute_id: "",
            institute_course_id: "",
            quota_id: "",
            category: "",
            ai_rank: undefined,
            state_rank: undefined,
            admission_status_id: "",
        },
    });

    useEffect(() => {
        const fetchRelations = async () => {
            const [counsellingRes, instRes, courseRes, quotaRes, statusRes] = await Promise.all([
                getDocsAction({ collection: "counsellings", limit: 100 }),
                getDocsAction({ collection: "institutes", limit: 1000 }),
                getDocsAction({ collection: "institute_courses", limit: 1000 }),
                getDocsAction({ collection: "counselling_quotas", limit: 100 }),
                getDocsAction({ collection: "admission_status", limit: 100 })
            ]);
            if (counsellingRes.success && counsellingRes.data) setCounsellings(counsellingRes.data.docs);
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
            if (courseRes.success && courseRes.data) setInstituteCourses(courseRes.data.docs);
            if (quotaRes.success && quotaRes.data) setQuotas(quotaRes.data.docs);
            if (statusRes.success && statusRes.data) setAdmissionStatuses(statusRes.data.docs);
        };
        fetchRelations();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 2024-25" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="round_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Round Number</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="counselling_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Counselling</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select counselling..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {counsellings.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="institute_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Institute</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select institute..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {institutes.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="institute_course_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Institute Course</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {instituteCourses.map(ic => <SelectItem key={ic.id} value={ic.id.toString()}>{ic.label || String(ic.id)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quota_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quota</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select quota..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {quotas.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. UR, OBC" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ai_rank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>AI Rank</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter AI rank" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state_rank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State Rank</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter state rank" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="admission_status_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admission Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select status..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {admissionStatuses.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : initialData ? "Update Allotment" : "Add Allotment"}
                </Button>
            </form>
        </Form>
    );
}
