"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { promoCodeSchema, PromoCodeFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PromoCodeFormProps {
  initialData?: any;
  onSubmit: (data: PromoCodeFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function PromoCodeForm({ initialData, onSubmit, isSubmitting }: PromoCodeFormProps) {
  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema) as any,
    defaultValues: {
      code: initialData?.code || "",
      discount_type: initialData?.discount_type || "percentage",
      discount_value: initialData?.discount_value || 0,
      usage_limit: initialData?.usage_limit || undefined,
      expiry_date: initialData?.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const handleFormSubmit = async (values: PromoCodeFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem><FormLabel>Promo Code *</FormLabel><FormControl><Input placeholder="e.g. SUMMER50" {...field} className="uppercase" onChange={(e) => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="discount_type" render={({ field }) => (
                <FormItem>
                    <FormLabel>Discount Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
            
            <FormField control={form.control} name="discount_value" render={({ field }) => (
                <FormItem><FormLabel>Discount Value *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="usage_limit" render={({ field }) => (
                <FormItem><FormLabel>Usage Limit (Optional)</FormLabel><FormControl><Input type="number" placeholder="No limit" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="expiry_date" render={({ field }) => (
                <FormItem><FormLabel>Expiry Date (Optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

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
            {initialData ? "Update Promo Code" : "Create Promo Code"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
