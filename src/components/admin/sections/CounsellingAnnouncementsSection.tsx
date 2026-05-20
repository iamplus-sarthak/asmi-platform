"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Megaphone } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingAnnouncementForm } from "@/components/admin/forms/CounsellingAnnouncementForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingAnnouncementFormValues } from "@/lib/validations/admin";

export function CounsellingAnnouncementsSection() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { topic: { like: search } } : {};
            const [aRes, cRes] = await Promise.all([
                getDocsAction({ collection: "counselling_announcements", limit: 100, query }),
                getDocsAction({ collection: "counsellings", limit: 100 })
            ]);
            if (aRes.success && aRes.data) setAnnouncements(aRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (a: any) => {
        if (!confirm(`Are you sure you want to delete this announcement?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counselling_announcements", id: a.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CounsellingAnnouncementFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { ...data, counselling_id: Number(data.counselling_id) };
            // clean up empty dates
            if (!payloadData.announcement_date) delete payloadData.announcement_date;

            const res = editingAnnouncement 
                ? await updateDocAction({ collection: "counselling_announcements", id: editingAnnouncement.id, data: payloadData })
                : await createDocAction({ collection: "counselling_announcements", data: payloadData });

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<any>[] = [
        {
            header: "Topic",
            cell: (a) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Megaphone className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[250px]">{a.topic}</span>
                </div>
            )
        },
        { header: "Counselling", cell: (a) => <span className="text-slate-600">{a.counselling_id?.name || "-"}</span> },
        { header: "Date", cell: (a) => <span className="text-sm">{a.announcement_date ? new Date(a.announcement_date).toLocaleDateString() : "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Counselling Announcements"
                description="Manage news and announcements for different counselling bodies"
                columns={columns}
                data={announcements}
                isLoading={isLoading}
                onAdd={() => { setEditingAnnouncement(null); setIsDrawerOpen(true); }}
                onEdit={(a) => { setEditingAnnouncement(a); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search topics..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingAnnouncement ? "Edit Announcement" : "Add Announcement"}
            >
                <CounsellingAnnouncementForm initialData={editingAnnouncement} counsellings={counsellings} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
