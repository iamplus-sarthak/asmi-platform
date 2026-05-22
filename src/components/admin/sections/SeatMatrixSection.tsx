"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { SeatMatrixForm } from "@/components/admin/forms/SeatMatrixForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { SeatMatrixFormValues } from "@/lib/validations/admin";

export function SeatMatrixSection() {
    const [matrices, setMatrices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingMatrix, setEditingMatrix] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const res = await getDocsAction({ collection: "seat_matrix", limit: 100 });
            if (res.success && res.data) setMatrices(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (m: any) => {
        if (!confirm(`Are you sure you want to delete this seat matrix?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "seat_matrix", id: m.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: SeatMatrixFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingMatrix 
                ? await updateDocAction({ collection: "seat_matrix", id: editingMatrix.id, data })
                : await createDocAction({ collection: "seat_matrix", data });

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
            header: "Institute & Round",
            cell: (m) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Grid className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{typeof m.institute_id === 'object' ? m.institute_id?.name : 'ID: ' + m.institute_id}</div>
                        <div className="text-xs text-slate-500">Round {m.round_no}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Seat Type",
            cell: (m) => (
                <div>
                    <div className="font-medium text-slate-900">{typeof m.quota_id === 'object' ? m.quota_id?.name : 'Quota: ' + m.quota_id}</div>
                    <div className="text-xs text-slate-500">Category: {m.category}</div>
                </div>
            )
        },
        {
            header: "Seats Available",
            cell: (m) => (
                <div>
                    <div className="font-medium text-slate-900">{m.total_seats} Seats</div>
                    {m.seats_remarks && <div className="text-xs text-slate-500">{m.seats_remarks}</div>}
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Seat Matrix"
                description="Manage available seats per institute and round"
                columns={columns}
                data={matrices}
                isLoading={isLoading}
                onAdd={() => { setEditingMatrix(null); setIsDrawerOpen(true); }}
                onEdit={(m) => {
                    setEditingMatrix({
                        ...m,
                        academic_year_id: typeof m.academic_year_id === 'object' ? m.academic_year_id?.id : m.academic_year_id,
                        counselling_id: typeof m.counselling_id === 'object' ? m.counselling_id?.id : m.counselling_id,
                        institute_id: typeof m.institute_id === 'object' ? m.institute_id?.id : m.institute_id,
                        institute_course_id: typeof m.institute_course_id === 'object' ? m.institute_course_id?.id : m.institute_course_id,
                        quota_id: typeof m.quota_id === 'object' ? m.quota_id?.id : m.quota_id,
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
                title={editingMatrix ? "Edit Seat Matrix" : "Add Seat Matrix"}
            >
                <SeatMatrixForm initialData={editingMatrix} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
