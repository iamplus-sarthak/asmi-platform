"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { videoSchema, VideoFormValues } from "@/lib/validations/admin";
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

interface VideoFormProps {
  initialData?: any;
  onSubmit: (data: VideoFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function VideoForm({
  initialData,
  onSubmit,
  isSubmitting,
}: VideoFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      thumbnail_url: initialData?.thumbnail_url || "",
      is_published: initialData?.is_published ?? true,
    },
  });

  const handleFormSubmit = async (values: VideoFormValues) => {
    try {
      setIsUploading(true);
      let thumbnailUrl = values.thumbnail_url;

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("alt", `${values.title} Thumbnail`);
        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          thumbnailUrl = res.media.url;
        }
      }

      await onSubmit({
        ...values,
        thumbnail_url: thumbnailUrl,
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
              <FormLabel>Video Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (YouTube/Vimeo)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://youtube.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div>
          <FormLabel className="block mb-2">Thumbnail Upload (Optional)</FormLabel>
          <div className="flex items-center gap-4">
            <Input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
            {form.watch("thumbnail_url") && !thumbnailFile && (
              <span className="text-xs text-green-600 font-medium">Current thumbnail present</span>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <div className="text-sm text-slate-500">
                  Make this video visible to users.
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
          <Button type="submit" disabled={isSubmitting || isUploading} className="bg-red-600 hover:bg-red-700">
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Video" : "Create Video"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
