"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Video, Check, X } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { VideoForm } from "@/components/admin/forms/VideoForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { VideoFormValues } from "@/lib/validations/admin";

export function VideosSection() {
    const [videos, setVideos] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { title: { like: search } } : {};
            const res = await getDocsAction({ collection: "videos", limit: 100, query });
            
            if (res.success && res.data) {
                setVideos(res.data.docs);
            }
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingVideo(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (video: any) => {
        setEditingVideo(video);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (video: any) => {
        if (!confirm(`Are you sure you want to delete ${video.title}?`)) return;
        
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "videos", id: video.id });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to delete");
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: VideoFormValues) => {
        setIsSubmitting(true);
        try {
            let res;
            
            if (editingVideo) {
                res = await updateDocAction({
                    collection: "videos",
                    id: editingVideo.id,
                    data,
                });
            } else {
                res = await createDocAction({
                    collection: "videos",
                    data,
                });
            }

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save video");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<any>[] = [
        {
            header: "Video Title",
            cell: (v) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-slate-900">{v.title}</span>
                </div>
            )
        },
        {
            header: "URL",
            cell: (v) => (
                <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] inline-block">
                    {v.url}
                </a>
            )
        },
        {
            header: "Published",
            cell: (v) => (
                v.is_published ? 
                <span className="flex items-center text-green-600"><Check className="h-4 w-4 mr-1" /> Yes</span> :
                <span className="flex items-center text-slate-400"><X className="h-4 w-4 mr-1" /> No</span>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Videos"
                description="Manage educational and informational video content"
                columns={columns}
                data={videos}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search videos..."
            />

            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingVideo ? "Edit Video" : "Add Video"}
                description={editingVideo ? "Update video details below." : "Fill in the details to add a new video."}
            >
                <VideoForm
                    initialData={editingVideo}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </>
    );
}
