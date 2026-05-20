"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { ExamCourseForm } from "@/components/admin/forms/ExamCourseForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { ExamCourseFormValues } from "@/lib/validations/admin";

export function ExamCoursesSection() {
    const [mappings, setMappings] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingMapping, setEditingMapping] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [mRes, eRes, cRes] = await Promise.all([
                getDocsAction({ collection: "exam_courses", limit: 100 }),
                getDocsAction({ collection: "exams", limit: 100 }),
                getDocsAction({ collection: "courses", limit: 100 })
            ]);
            if (mRes.success && mRes.data) setMappings(mRes.data.docs);
            if (eRes.success && eRes.data) setExams(eRes.data.docs);
            if (cRes.success && cRes.data) setCourses(cRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (m: any) => {
        if (!confirm(`Are you sure you want to remove this course from the exam?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "exam_courses", id: m.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: ExamCourseFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { 
                ...data, 
                exam_id: Number(data.exam_id),
                course_id: Number(data.course_id)
            };

            const res = editingMapping 
                ? await updateDocAction({ collection: "exam_courses", id: editingMapping.id, data: payloadData })
                : await createDocAction({ collection: "exam_courses", data: payloadData });

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
            header: "Exam",
            cell: (m) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-rose-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{m.exam_id?.name || "-"}</span>
                </div>
            )
        },
        { header: "Course", cell: (m) => <span className="font-medium text-slate-700 truncate max-w-[300px] inline-block">{m.course_id?.name || "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Exam Courses"
                description="Map master courses to their respective entrance exams"
                columns={columns}
                data={mappings}
                isLoading={isLoading}
                onAdd={() => { setEditingMapping(null); setIsDrawerOpen(true); }}
                onEdit={(m) => { setEditingMapping(m); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingMapping ? "Edit Mapping" : "Map Course to Exam"}
            >
                <ExamCourseForm 
                    initialData={editingMapping} 
                    exams={exams} 
                    courses={courses}
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </CrudDrawer>
        </>
    );
}
