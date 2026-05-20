"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DollarSign } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteCourseFeeForm } from "@/components/admin/forms/InstituteCourseFeeForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { InstituteCourseFeeFormValues } from "@/lib/validations/admin";

export function InstituteCourseFeesSection() {
    const [fees, setFees] = useState<any[]>([]);
    const [instituteCourses, setInstituteCourses] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [counsellingQuotas, setCounsellingQuotas] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [feeRes, icRes, cRes, qRes, aRes] = await Promise.all([
                getDocsAction({ collection: "institute_course_fees", limit: 100 }),
                getDocsAction({ collection: "institute_courses", limit: 100 }),
                getDocsAction({ collection: "counsellings", limit: 100 }),
                getDocsAction({ collection: "counselling_quotas", limit: 100 }),
                getDocsAction({ collection: "academic_years", limit: 100 })
            ]);
            if (feeRes.success && feeRes.data) setFees(feeRes.data.docs);
            if (icRes.success && icRes.data) setInstituteCourses(icRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
            if (qRes.success && qRes.data) setCounsellingQuotas(qRes.data.docs);
            if (aRes.success && aRes.data) setAcademicYears(aRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (f: any) => {
        if (!confirm(`Are you sure you want to delete this fee structure?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institute_course_fees", id: f.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: InstituteCourseFeeFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = {
                ...data,
                institute_course_id: Number(data.institute_course_id),
                counselling_id: Number(data.counselling_id),
                quota_id: Number(data.quota_id),
                academic_year_id: Number(data.academic_year_id),
            };

            const res = editingFee 
                ? await updateDocAction({ collection: "institute_course_fees", id: editingFee.id, data: payloadData })
                : await createDocAction({ collection: "institute_course_fees", data: payloadData });

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
            header: "Institute & Course",
            cell: (f) => {
                const ic = f.institute_course_id;
                const instName = ic?.institute_id?.name || "-";
                const courseName = ic?.course_id?.name || "-";
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-900 truncate max-w-[200px]">{instName}</span>
                            <span className="text-xs text-slate-500">{courseName}</span>
                        </div>
                    </div>
                )
            }
        },
        { header: "Counselling", cell: (f) => <span className="font-medium">{f.counselling_id?.name || "-"}</span> },
        { header: "Quota", cell: (f) => <span className="font-medium">{f.quota_id?.name || "-"}</span> },
        { header: "Annual Fee", cell: (f) => <span className="font-semibold text-slate-900">₹{f.annual_fee?.toLocaleString() || "0"}</span> },
        { header: "Academic Year", cell: (f) => <span className="text-slate-600">{f.academic_year_id?.year || "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Course Fees"
                description="Manage fee structures, stipends, and bonds for institute courses"
                columns={columns}
                data={fees}
                isLoading={isLoading}
                onAdd={() => { setEditingFee(null); setIsDrawerOpen(true); }}
                onEdit={(f) => { setEditingFee(f); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingFee ? "Edit Fee Structure" : "Add Fee Structure"}
            >
                <InstituteCourseFeeForm 
                    initialData={editingFee} 
                    instituteCourses={instituteCourses}
                    counsellings={counsellings}
                    counsellingQuotas={counsellingQuotas}
                    academicYears={academicYears}
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </CrudDrawer>
        </>
    );
}
