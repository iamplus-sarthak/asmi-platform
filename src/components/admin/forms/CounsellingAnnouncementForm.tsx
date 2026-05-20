"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingAnnouncementSchema, CounsellingAnnouncementFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CounsellingAnnouncementFormProps {
  initialData?: any;
  counsellings: any[];
  onSubmit: (data: CounsellingAnnouncementFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingAnnouncementForm({ initialData, counsellings, onSubmit, isSubmitting }: CounsellingAnnouncementFormProps) {
  const form = useForm<CounsellingAnnouncementFormValues>({
    resolver: zodResolver(counsellingAnnouncementSchema),
    defaultValues: {
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      topic: initialData?.topic || "",
      description: initialData?.description || "",
      announcement_date: initialData?.announcement_date ? new Date(initialData.announcement_date).toISOString().split('T')[0] : "",
      link: initialData?.link || "",
      link_tag: initialData?.link_tag || "",
    },
  });

  const handleFormSubmit = async (values: CounsellingAnnouncementFormValues) => {
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

        <FormField control={form.control} name="topic" render={({ field }) => (
            <FormItem><FormLabel>Topic *</FormLabel><FormControl><Input placeholder="e.g. Merit List Released" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Details of announcement" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="announcement_date" render={({ field }) => (
            <FormItem><FormLabel>Announcement Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem><FormLabel>Link URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="link_tag" render={({ field }) => (
                <FormItem><FormLabel>Link Tag</FormLabel><FormControl><Input placeholder="e.g. Download PDF" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Announcement" : "Add Announcement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
