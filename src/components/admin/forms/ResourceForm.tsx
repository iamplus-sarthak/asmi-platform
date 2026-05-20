"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { resourceSchema, ResourceFormValues } from "@/lib/validations/admin";
import { uploadMediaAction } from "@/actions/admin-crud";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourceFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ResourceForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ResourceFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      resource_type: initialData?.resource_type || "pdf",
      external_url: initialData?.external_url || "",
      is_published: initialData?.is_published ?? true,
    },
  });

  const resourceType = form.watch("resource_type");

  const handleFormSubmit = async (values: ResourceFormValues) => {
    try {
      setIsUploading(true);
      let fileId = initialData?.file?.id || initialData?.file;

      if (resourceType !== 'link' && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", `${values.title} File`);
        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          fileId = res.media.id;
        }
      }

      await onSubmit({
        ...values,
        file: resourceType !== 'link' ? fileId : null,
        external_url: resourceType === 'link' ? values.external_url : null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resource_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {resourceType === "link" ? (
          <FormField
            control={form.control}
            name="external_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div>
            <FormLabel className="block mb-2">Upload File</FormLabel>
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept={resourceType === 'pdf' ? '.pdf' : resourceType === 'image' ? 'image/*' : '*'}
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
              {initialData?.file && !file && (
                <span className="text-xs text-green-600 font-medium">Current file present</span>
              )}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write a short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <div className="text-sm text-slate-500">
                  Make this resource visible to users.
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting || isUploading} className="bg-blue-600 hover:bg-blue-700">
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Resource" : "Create Resource"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
