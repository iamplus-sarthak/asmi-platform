"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PieChart } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingQuotaForm } from "@/components/admin/forms/CounsellingQuotaForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingQuotaFormValues } from "@/lib/validations/admin";

export function CounsellingQuotasSection() {
    const [quotas, setQuotas] = useState<any[]>([]);
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingQuota, setEditingQuota] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const [qRes, cRes] = await Promise.all([
                getDocsAction({ collection: "counselling_quotas", limit: 100, query }),
                getDocsAction({ collection: "counsellings", limit: 100 })
            ]);
            if (qRes.success && qRes.data) setQuotas(qRes.data.docs);
            if (cRes.success && cRes.data) setCounsellings(cRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (q: any) => {
        if (!confirm(`Are you sure you want to delete quota: ${q.name}?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counselling_quotas", id: q.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: CounsellingQuotaFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { ...data, counselling_id: Number(data.counselling_id) };
            const res = editingQuota 
                ? await updateDocAction({ collection: "counselling_quotas", id: editingQuota.id, data: payloadData })
                : await createDocAction({ collection: "counselling_quotas", data: payloadData });

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
            header: "Quota Name",
            cell: (q) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-slate-900">{q.name}</span>
                </div>
            )
        },
        { header: "Counselling", cell: (q) => <span className="text-slate-600">{q.counselling_id?.name || "-"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Counselling Quotas"
                description="Manage AIQ, State Quota, Management and other quotas for counsellings"
                columns={columns}
                data={quotas}
                isLoading={isLoading}
                onAdd={() => { setEditingQuota(null); setIsDrawerOpen(true); }}
                onEdit={(q) => { setEditingQuota(q); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search quotas..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingQuota ? "Edit Quota" : "Add Quota"}
            >
                <CounsellingQuotaForm initialData={editingQuota} counsellings={counsellings} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
