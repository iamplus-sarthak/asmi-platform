"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { instituteHospitalSchema, InstituteHospitalFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InstituteHospitalFormProps {
  initialData?: any;
  institutes: any[];
  onSubmit: (data: InstituteHospitalFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteHospitalForm({ initialData, institutes, onSubmit, isSubmitting }: InstituteHospitalFormProps) {
  const form = useForm<InstituteHospitalFormValues>({
    resolver: zodResolver(instituteHospitalSchema) as any,
    defaultValues: {
      institute_id: initialData?.institute_id?.id || initialData?.institute_id || "",
      hospital_name: initialData?.hospital_name || "",
      bed_count: initialData?.bed_count,
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = async (values: InstituteHospitalFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="institute_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Institute *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select institute" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {institutes.map((inst) => <SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="hospital_name" render={({ field }) => (
            <FormItem><FormLabel>Hospital Name *</FormLabel><FormControl><Input placeholder="e.g. AIIMS Hospital" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="bed_count" render={({ field }) => (
            <FormItem><FormLabel>Total Beds</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description / Details</FormLabel><FormControl><Textarea placeholder="Additional information" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Hospital" : "Add Hospital"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
