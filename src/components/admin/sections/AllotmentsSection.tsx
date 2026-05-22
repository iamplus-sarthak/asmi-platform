"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GitMerge } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { AllotmentForm } from "@/components/admin/forms/AllotmentForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { AllotmentFormValues } from "@/lib/validations/admin";

export function AllotmentsSection() {
    const [allotments, setAllotments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingAllotment, setEditingAllotment] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            // Can't easily search across deep relationships without custom aggregation, 
            // so we'll just fetch latest. In a real app, we'd add custom endpoints for complex searches.
            const res = await getDocsAction({ collection: "allotments", limit: 100 });
            if (res.success && res.data) setAllotments(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (a: any) => {
        if (!confirm(`Are you sure you want to delete this allotment?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "allotments", id: a.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: AllotmentFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingAllotment 
                ? await updateDocAction({ collection: "allotments", id: editingAllotment.id, data })
                : await createDocAction({ collection: "allotments", data });

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
            header: "Year & Round",
            cell: (a) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <GitMerge className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{a.year}</div>
                        <div className="text-xs text-slate-500">Round {a.round_no}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Institute",
            cell: (a) => (
                <div>
                    <div className="font-medium text-slate-900">{typeof a.institute_id === 'object' ? a.institute_id?.name : 'ID: ' + a.institute_id}</div>
                    <div className="text-xs text-slate-500">{typeof a.counselling_id === 'object' ? a.counselling_id?.name : 'Counselling ID: ' + a.counselling_id}</div>
                </div>
            )
        },
        {
            header: "Seat Details",
            cell: (a) => (
                <div>
                    <div className="font-medium text-slate-900">{typeof a.quota_id === 'object' ? a.quota_id?.name : 'Quota: ' + a.quota_id}</div>
                    <div className="text-xs text-slate-500">Cat: {a.category} | AI Rank: {a.ai_rank || 'N/A'}</div>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Allotments"
                description="Manage seat allotments per round"
                columns={columns}
                data={allotments}
                isLoading={isLoading}
                onAdd={() => { setEditingAllotment(null); setIsDrawerOpen(true); }}
                onEdit={(a) => {
                    // Extract IDs for form population if they are populated objects
                    setEditingAllotment({
                        ...a,
                        counselling_id: typeof a.counselling_id === 'object' ? a.counselling_id?.id : a.counselling_id,
                        institute_id: typeof a.institute_id === 'object' ? a.institute_id?.id : a.institute_id,
                        institute_course_id: typeof a.institute_course_id === 'object' ? a.institute_course_id?.id : a.institute_course_id,
                        quota_id: typeof a.quota_id === 'object' ? a.quota_id?.id : a.quota_id,
                        admission_status_id: typeof a.admission_status_id === 'object' ? a.admission_status_id?.id : a.admission_status_id,
                    }); 
                    setIsDrawerOpen(true); 
                }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search is limited for relations..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingAllotment ? "Edit Allotment" : "Add Allotment"}
            >
                <AllotmentForm initialData={editingAllotment} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
