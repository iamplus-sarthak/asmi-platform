"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Stethoscope } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteHospitalForm } from "@/components/admin/forms/InstituteHospitalForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { InstituteHospitalFormValues } from "@/lib/validations/admin";

export function InstituteHospitalsSection() {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingHospital, setEditingHospital] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { hospital_name: { like: search } } : {};
            const [hospRes, instRes] = await Promise.all([
                getDocsAction({ collection: "institute_hospitals", limit: 100, query }),
                getDocsAction({ collection: "institutes", limit: 100 })
            ]);
            if (hospRes.success && hospRes.data) setHospitals(hospRes.data.docs);
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (h: any) => {
        if (!confirm(`Are you sure you want to delete this hospital?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institute_hospitals", id: h.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: InstituteHospitalFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { ...data, institute_id: Number(data.institute_id) };

            const res = editingHospital 
                ? await updateDocAction({ collection: "institute_hospitals", id: editingHospital.id, data: payloadData })
                : await createDocAction({ collection: "institute_hospitals", data: payloadData });

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
            header: "Hospital Name",
            cell: (h) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-slate-900">{h.hospital_name}</span>
                </div>
            )
        },
        { header: "Institute", cell: (h) => <span className="text-sm truncate max-w-[200px] inline-block">{h.institute_id?.name || "-"}</span> },
        { header: "Beds", accessorKey: "bed_count" },
    ];

    return (
        <>
            <DataTable
                title="Institute Hospitals"
                description="Manage hospitals attached to medical institutes"
                columns={columns}
                data={hospitals}
                isLoading={isLoading}
                onAdd={() => { setEditingHospital(null); setIsDrawerOpen(true); }}
                onEdit={(h) => { setEditingHospital(h); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search hospitals..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingHospital ? "Edit Hospital" : "Add Hospital"}
            >
                <InstituteHospitalForm initialData={editingHospital} institutes={institutes} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
