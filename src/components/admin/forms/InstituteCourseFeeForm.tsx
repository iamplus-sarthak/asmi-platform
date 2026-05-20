"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { instituteCourseFeeSchema, InstituteCourseFeeFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InstituteCourseFeeFormProps {
  initialData?: any;
  instituteCourses: any[];
  counsellings: any[];
  counsellingQuotas: any[];
  academicYears: any[];
  onSubmit: (data: InstituteCourseFeeFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteCourseFeeForm({ 
    initialData, 
    instituteCourses, 
    counsellings, 
    counsellingQuotas, 
    academicYears, 
    onSubmit, 
    isSubmitting 
}: InstituteCourseFeeFormProps) {
  const form = useForm<InstituteCourseFeeFormValues>({
    resolver: zodResolver(instituteCourseFeeSchema) as any,
    defaultValues: {
      institute_course_id: initialData?.institute_course_id?.id || initialData?.institute_course_id || "",
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      quota_id: initialData?.quota_id?.id || initialData?.quota_id || "",
      academic_year_id: initialData?.academic_year_id?.id || initialData?.academic_year_id || "",
      annual_fee: initialData?.annual_fee || undefined,
      fee_remarks: initialData?.fee_remarks || "",
      stipend_year_1: initialData?.stipend_year_1 || undefined,
      stipend_year_2: initialData?.stipend_year_2 || undefined,
      stipend_year_3: initialData?.stipend_year_3 || undefined,
      stipend_remarks: initialData?.stipend_remarks || "",
      bond_years: initialData?.bond_years || undefined,
      bond_penalty_amount: initialData?.bond_penalty_amount || undefined,
      bond_remarks: initialData?.bond_remarks || "",
    },
  });

  const handleFormSubmit = async (values: InstituteCourseFeeFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="institute_course_id" render={({ field }) => (
                <FormItem className="col-span-2">
                    <FormLabel>Institute & Course *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select mapping" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {instituteCourses.map((ic) => (
                                <SelectItem key={ic.id} value={ic.id.toString()}>
                                    {ic.institute_id?.name} - {ic.course_id?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="counselling_id" render={({ field }) => (
                <FormItem>
                    <FormLabel>Counselling *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select counselling" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {counsellings.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="quota_id" render={({ field }) => (
                <FormItem>
                    <FormLabel>Quota *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select quota" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {counsellingQuotas.map((q) => <SelectItem key={q.id} value={q.id.toString()}>{q.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="academic_year_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Academic Year *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select academic year" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {academicYears.map((ay) => <SelectItem key={ay.id} value={ay.id.toString()}>{ay.year}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-slate-800">Fee Details</h3>
            <FormField control={form.control} name="annual_fee" render={({ field }) => (
                <FormItem><FormLabel>Annual Fee (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="fee_remarks" render={({ field }) => (
                <FormItem><FormLabel>Fee Remarks</FormLabel><FormControl><Textarea placeholder="Any notes on fees" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-slate-800">Stipend Details</h3>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="stipend_year_1" render={({ field }) => (
                    <FormItem><FormLabel>Year 1 (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="stipend_year_2" render={({ field }) => (
                    <FormItem><FormLabel>Year 2 (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="stipend_year_3" render={({ field }) => (
                    <FormItem><FormLabel>Year 3 (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="stipend_remarks" render={({ field }) => (
                <FormItem><FormLabel>Stipend Remarks</FormLabel><FormControl><Textarea placeholder="Any notes on stipend" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-slate-800">Bond Details</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="bond_years" render={({ field }) => (
                    <FormItem><FormLabel>Bond Years</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="bond_penalty_amount" render={({ field }) => (
                    <FormItem><FormLabel>Penalty Amount (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="bond_remarks" render={({ field }) => (
                <FormItem><FormLabel>Bond Remarks</FormLabel><FormControl><Textarea placeholder="Any notes on bond" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Fee Structure" : "Add Fee Structure"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
