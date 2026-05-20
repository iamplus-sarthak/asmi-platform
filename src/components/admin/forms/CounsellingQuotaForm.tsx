"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingQuotaSchema, CounsellingQuotaFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CounsellingQuotaFormProps {
  initialData?: any;
  counsellings: any[];
  onSubmit: (data: CounsellingQuotaFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingQuotaForm({ initialData, counsellings, onSubmit, isSubmitting }: CounsellingQuotaFormProps) {
  const form = useForm<CounsellingQuotaFormValues>({
    resolver: zodResolver(counsellingQuotaSchema),
    defaultValues: {
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = async (values: CounsellingQuotaFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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

        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Quota Name *</FormLabel><FormControl><Input placeholder="e.g. AIQ, State Quota" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Details about this quota" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Quota" : "Add Quota"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
