"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { AcademicYearForm } from "@/components/admin/forms/AcademicYearForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { AcademicYearFormValues } from "@/lib/validations/admin";

export function AcademicYearsSection() {
    const [years, setYears] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { year: { like: search } } : {};
            const res = await getDocsAction({ collection: "academic_years", limit: 100, query });
            if (res.success && res.data) setYears(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (y: any) => {
        if (!confirm(`Are you sure you want to delete ${y.year}?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "academic_years", id: y.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: AcademicYearFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingYear 
                ? await updateDocAction({ collection: "academic_years", id: editingYear.id, data })
                : await createDocAction({ collection: "academic_years", data });

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
            header: "Academic Year",
            cell: (y) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-slate-900">{y.year}</span>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Academic Years"
                description="Manage academic year sessions"
                columns={columns}
                data={years}
                isLoading={isLoading}
                onAdd={() => { setEditingYear(null); setIsDrawerOpen(true); }}
                onEdit={(y) => { setEditingYear(y); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search year..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingYear ? "Edit Academic Year" : "Add Academic Year"}
            >
                <AcademicYearForm initialData={editingYear} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
