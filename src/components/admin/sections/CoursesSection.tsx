"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Stethoscope } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CourseForm } from "@/components/admin/forms/CourseForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CourseMasterFormValues } from "@/lib/validations/admin";

export function CoursesSection() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const res = await getDocsAction({ collection: "courses", limit: 100, query });
            if (res.success && res.data) setCourses(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (c: any) => {
        if (!confirm(`Are you sure you want to delete ${c.name}?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "courses", id: c.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CourseMasterFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingCourse 
                ? await updateDocAction({ collection: "courses", id: editingCourse.id, data })
                : await createDocAction({ collection: "courses", data });

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
            header: "Course Name",
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-slate-900">{c.name}</span>
                </div>
            )
        },
        { header: "Type", cell: (c) => <span className="capitalize text-slate-600">{c.course_type?.replace('_', '-')}</span> },
        { header: "Degree", cell: (c) => <span className="capitalize font-medium text-slate-700">{c.degree_type}</span> },
        { header: "Duration", accessorKey: "duration" },
    ];

    return (
        <>
            <DataTable
                title="Master Courses"
                description="Manage the master list of all medical courses available globally"
                columns={columns}
                data={courses}
                isLoading={isLoading}
                onAdd={() => { setEditingCourse(null); setIsDrawerOpen(true); }}
                onEdit={(c) => { setEditingCourse(c); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search courses..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingCourse ? "Edit Master Course" : "Add Master Course"}
            >
                <CourseForm initialData={editingCourse} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
