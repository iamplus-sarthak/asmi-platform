"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { subscriptionPlanSchema, SubscriptionPlanFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface SubscriptionPlanFormProps {
  initialData?: any;
  onSubmit: (data: SubscriptionPlanFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function SubscriptionPlanForm({ initialData, onSubmit, isSubmitting }: SubscriptionPlanFormProps) {
  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      duration_days: initialData?.duration_days || 30,
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const handleFormSubmit = async (values: SubscriptionPlanFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Plan Name *</FormLabel><FormControl><Input placeholder="e.g. Basic, Pro" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="duration_days" render={({ field }) => (
                <FormItem><FormLabel>Duration (Days) *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Plan features..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="is_active" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>Active Status</FormLabel>
                </div>
            </FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
