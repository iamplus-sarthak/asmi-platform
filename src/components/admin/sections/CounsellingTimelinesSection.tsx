"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingTimelineForm } from "@/components/admin/forms/CounsellingTimelineForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingTimelineFormValues } from "@/lib/validations/admin";

export function CounsellingTimelinesSection() {
    const [timelines, setTimelines] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingTimeline, setEditingTimeline] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { title: { like: search } } : {};
            const [tRes, cRes] = await Promise.all([
                getDocsAction({ collection: "counselling_timelines", limit: 100, query }),
                getDocsAction({ collection: "counsellings", limit: 100 })
            ]);
            if (tRes.success && tRes.data) setTimelines(tRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (t: any) => {
        if (!confirm(`Are you sure you want to delete this event?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counselling_timelines", id: t.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CounsellingTimelineFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { ...data, counselling_id: Number(data.counselling_id) };

            const res = editingTimeline 
                ? await updateDocAction({ collection: "counselling_timelines", id: editingTimeline.id, data: payloadData })
                : await createDocAction({ collection: "counselling_timelines", data: payloadData });

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
            header: "Event",
            cell: (t) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-cyan-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[250px]">{t.title}</span>
                </div>
            )
        },
        { header: "Counselling", cell: (t) => <span className="text-slate-600">{t.counselling_id?.name || "-"}</span> },
        { header: "Event Date", cell: (t) => <span className="font-medium text-slate-900">{t.event_date ? new Date(t.event_date).toLocaleDateString() : "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Counselling Timelines"
                description="Manage important dates and events for counsellings"
                columns={columns}
                data={timelines}
                isLoading={isLoading}
                onAdd={() => { setEditingTimeline(null); setIsDrawerOpen(true); }}
                onEdit={(t) => { setEditingTimeline(t); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search events..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingTimeline ? "Edit Event" : "Add Event"}
            >
                <CounsellingTimelineForm initialData={editingTimeline} counsellings={counsellings} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
