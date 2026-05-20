"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileSignature } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { ExamForm } from "@/components/admin/forms/ExamForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { ExamFormValues } from "@/lib/validations/admin";

export function ExamsSection() {
    const [exams, setExams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const res = await getDocsAction({ collection: "exams", limit: 100, query });
            if (res.success && res.data) setExams(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (e: any) => {
        if (!confirm(`Are you sure you want to delete exam: ${e.name}?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "exams", id: e.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: ExamFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingExam 
                ? await updateDocAction({ collection: "exams", id: editingExam.id, data })
                : await createDocAction({ collection: "exams", data });

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
            header: "Exam Name",
            cell: (e) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <FileSignature className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{e.name}</span>
                        <span className="text-xs text-slate-500">{e.short_name}</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Entrance Exams"
                description="Manage entrance exams (e.g. NEET UG, NEET PG)"
                columns={columns}
                data={exams}
                isLoading={isLoading}
                onAdd={() => { setEditingExam(null); setIsDrawerOpen(true); }}
                onEdit={(e) => { setEditingExam(e); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search exams..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingExam ? "Edit Exam" : "Add Exam"}
            >
                <ExamForm initialData={editingExam} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
