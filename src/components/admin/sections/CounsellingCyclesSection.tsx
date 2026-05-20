"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingCycleForm } from "@/components/admin/forms/CounsellingCycleForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingCycleFormValues } from "@/lib/validations/admin";

export function CounsellingCyclesSection() {
    const [cycles, setCycles] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCycle, setEditingCycle] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [cycRes, cRes, aRes] = await Promise.all([
                getDocsAction({ collection: "counselling_cycles", limit: 100 }),
                getDocsAction({ collection: "counsellings", limit: 100 }),
                getDocsAction({ collection: "academic_years", limit: 100 })
            ]);
            if (cycRes.success && cycRes.data) setCycles(cycRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
            if (aRes.success && aRes.data) setAcademicYears(aRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (c: any) => {
        if (!confirm(`Are you sure you want to delete this cycle?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counselling_cycles", id: c.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CounsellingCycleFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { 
                ...data, 
                counselling_id: Number(data.counselling_id),
                academic_year_id: Number(data.academic_year_id)
            };

            const res = editingCycle 
                ? await updateDocAction({ collection: "counselling_cycles", id: editingCycle.id, data: payloadData })
                : await createDocAction({ collection: "counselling_cycles", data: payloadData });

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
            header: "Counselling",
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <RefreshCcw className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-slate-900">{c.counselling_id?.name || "-"}</span>
                </div>
            )
        },
        { header: "Academic Year", cell: (c) => <span className="font-medium text-slate-700">{c.academic_year_id?.year || "-"}</span> },
        { header: "Total Rounds", accessorKey: "total_rounds" },
    ];

    return (
        <>
            <DataTable
                title="Counselling Cycles"
                description="Manage counselling cycles across academic years"
                columns={columns}
                data={cycles}
                isLoading={isLoading}
                onAdd={() => { setEditingCycle(null); setIsDrawerOpen(true); }}
                onEdit={(c) => { setEditingCycle(c); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingCycle ? "Edit Cycle" : "Add Cycle"}
            >
                <CounsellingCycleForm 
                    initialData={editingCycle} 
                    counsellings={counsellings} 
                    academicYears={academicYears}
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </CrudDrawer>
        </>
    );
}
