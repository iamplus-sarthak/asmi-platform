"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingInstituteForm } from "@/components/admin/forms/CounsellingInstituteForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingInstituteFormValues } from "@/lib/validations/admin";

export function CounsellingInstitutesSection() {
    const [mappings, setMappings] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingMapping, setEditingMapping] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [mRes, cRes, iRes] = await Promise.all([
                getDocsAction({ collection: "counselling_institutes", limit: 100 }),
                getDocsAction({ collection: "counsellings", limit: 100 }),
                getDocsAction({ collection: "institutes", limit: 100 })
            ]);
            if (mRes.success && mRes.data) setMappings(mRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
            if (iRes.success && iRes.data) setInstitutes(iRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (m: any) => {
        if (!confirm(`Are you sure you want to remove this institute from the counselling?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counselling_institutes", id: m.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CounsellingInstituteFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { 
                ...data, 
                counselling_id: Number(data.counselling_id),
                institute_id: Number(data.institute_id)
            };

            const res = editingMapping 
                ? await updateDocAction({ collection: "counselling_institutes", id: editingMapping.id, data: payloadData })
                : await createDocAction({ collection: "counselling_institutes", data: payloadData });

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
            cell: (m) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-rose-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{m.counselling_id?.name || "-"}</span>
                </div>
            )
        },
        { header: "Institute", cell: (m) => <span className="font-medium text-slate-700 truncate max-w-[300px] inline-block">{m.institute_id?.name || "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Mapped Institutes"
                description="Link institutes to their respective counsellings"
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
                title={editingMapping ? "Edit Mapping" : "Map Institute"}
            >
                <CounsellingInstituteForm 
                    initialData={editingMapping} 
                    counsellings={counsellings} 
                    institutes={institutes}
                    onSubmit={onSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </CrudDrawer>
        </>
    );
}
