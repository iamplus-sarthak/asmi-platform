"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteCourseForm } from "@/components/admin/forms/InstituteCourseForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { InstituteCourseFormValues } from "@/lib/validations/admin";

export function InstituteCoursesSection() {
    const [coursesList, setCoursesList] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [icRes, instRes, cRes] = await Promise.all([
                getDocsAction({ collection: "institute_courses", limit: 100 }),
                getDocsAction({ collection: "institutes", limit: 100 }),
                getDocsAction({ collection: "courses", limit: 100 })
            ]);
            if (icRes.success && icRes.data) setCoursesList(icRes.data.docs);
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
            if (cRes.success && cRes.data) setCourses(cRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (ic: any) => {
        if (!confirm(`Are you sure you want to delete this course mapping?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institute_courses", id: ic.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: InstituteCourseFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = {
                ...data,
                institute_id: Number(data.institute_id),
                course_id: Number(data.course_id),
            };

            const res = editingCourse 
                ? await updateDocAction({ collection: "institute_courses", id: editingCourse.id, data: payloadData })
                : await createDocAction({ collection: "institute_courses", data: payloadData });

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
            header: "Label",
            cell: (ic) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{ic.label || "-"}</span>
                </div>
            )
        },
        { header: "Institute", cell: (ic) => <span className="text-sm">{ic.institute_id?.name || "-"}</span> },
        { header: "Course", cell: (ic) => <span className="font-medium">{ic.course_id?.name || "-"}</span> },
        { header: "Total Seats", accessorKey: "total_seats" },
    ];

    return (
        <>
            <DataTable
                title="Institute Courses"
                description="Manage course mappings and intake capacities for institutes"
                columns={columns}
                data={coursesList}
                isLoading={isLoading}
                onAdd={() => { setEditingCourse(null); setIsDrawerOpen(true); }}
                onEdit={(ic) => { setEditingCourse(ic); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingCourse ? "Edit Institute Course" : "Map Course to Institute"}
            >
                <InstituteCourseForm 
                    initialData={editingCourse} 
                    institutes={institutes}
                    courses={courses}
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </CrudDrawer>
        </>
    );
}
