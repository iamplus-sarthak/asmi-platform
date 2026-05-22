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
import { seatMatrixSchema, SeatMatrixFormValues } from "@/lib/validations/admin";
import { getDocsAction } from "@/actions/admin-crud";

interface SeatMatrixFormProps {
    initialData?: any | null;
    onSubmit: (data: SeatMatrixFormValues) => void;
    isSubmitting: boolean;
}

export function SeatMatrixForm({ initialData, onSubmit, isSubmitting }: SeatMatrixFormProps) {
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [instituteCourses, setInstituteCourses] = useState<any[]>([]);
    const [quotas, setQuotas] = useState<any[]>([]);

    const form = useForm<SeatMatrixFormValues>({
        resolver: zodResolver(seatMatrixSchema) as any,
        defaultValues: initialData || {
            academic_year_id: "",
            counselling_id: "",
            institute_id: "",
            institute_course_id: "",
            quota_id: "",
            category: "",
            round_no: 1,
            total_seats: 0,
            seats_remarks: "",
        },
    });

    useEffect(() => {
        const fetchRelations = async () => {
            const [ayRes, counsellingRes, instRes, courseRes, quotaRes] = await Promise.all([
                getDocsAction({ collection: "academic_years", limit: 100 }),
                getDocsAction({ collection: "counsellings", limit: 100 }),
                getDocsAction({ collection: "institutes", limit: 1000 }),
                getDocsAction({ collection: "institute_courses", limit: 1000 }),
                getDocsAction({ collection: "counselling_quotas", limit: 100 })
            ]);
            if (ayRes.success && ayRes.data) setAcademicYears(ayRes.data.docs);
            if (counsellingRes.success && counsellingRes.data) setCounsellings(counsellingRes.data.docs);
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
            if (courseRes.success && courseRes.data) setInstituteCourses(courseRes.data.docs);
            if (quotaRes.success && quotaRes.data) setQuotas(quotaRes.data.docs);
        };
        fetchRelations();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="academic_year_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Academic Year</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select year..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {academicYears.map(ay => <SelectItem key={ay.id} value={ay.id.toString()}>{ay.year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>

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
                                    <Input placeholder="e.g. Open, OBC" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="round_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Round</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="total_seats"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Seats</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seats_remarks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remarks (Opt)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 0+3(VV)" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : initialData ? "Update Seat Matrix" : "Add Seat Matrix"}
                </Button>
            </form>
        </Form>
    );
}
