"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingTimelineSchema, CounsellingTimelineFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CounsellingTimelineFormProps {
  initialData?: any;
  counsellings: any[];
  onSubmit: (data: CounsellingTimelineFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingTimelineForm({ initialData, counsellings, onSubmit, isSubmitting }: CounsellingTimelineFormProps) {
  const form = useForm<CounsellingTimelineFormValues>({
    resolver: zodResolver(counsellingTimelineSchema),
    defaultValues: {
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      title: initialData?.title || "",
      event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : "",
    },
  });

  const handleFormSubmit = async (values: CounsellingTimelineFormValues) => {
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

        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Event Title *</FormLabel><FormControl><Input placeholder="e.g. Round 1 Registration Begins" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="event_date" render={({ field }) => (
            <FormItem><FormLabel>Event Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Event" : "Add Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
