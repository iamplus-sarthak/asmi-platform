"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { instituteHostelSchema, InstituteHostelFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface InstituteHostelFormProps {
  initialData?: any;
  institutes: any[];
  onSubmit: (data: InstituteHostelFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteHostelForm({ initialData, institutes, onSubmit, isSubmitting }: InstituteHostelFormProps) {
  const form = useForm<InstituteHostelFormValues>({
    resolver: zodResolver(instituteHostelSchema) as any,
    defaultValues: {
      institute_id: initialData?.institute_id?.id || initialData?.institute_id || "",
      is_men_hostel_available: initialData?.is_men_hostel_available ?? false,
      is_women_hostel_available: initialData?.is_women_hostel_available ?? false,
      hostel_fee_details: initialData?.hostel_fee_details || "",
      hostel_fee_link: initialData?.hostel_fee_link || "",
    },
  });

  const handleFormSubmit = async (values: InstituteHostelFormValues) => {
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

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="is_men_hostel_available" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel className="text-base">Men Hostel</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}/>

            <FormField control={form.control} name="is_women_hostel_available" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel className="text-base">Women Hostel</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="hostel_fee_details" render={({ field }) => (
            <FormItem><FormLabel>Fee Details</FormLabel><FormControl><Textarea placeholder="Information about fees" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="hostel_fee_link" render={({ field }) => (
            <FormItem><FormLabel>Fee URL Link</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Hostel" : "Add Hostel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
