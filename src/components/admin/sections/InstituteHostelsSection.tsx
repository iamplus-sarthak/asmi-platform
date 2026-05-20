"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Home } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteHostelForm } from "@/components/admin/forms/InstituteHostelForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { InstituteHostelFormValues } from "@/lib/validations/admin";

export function InstituteHostelsSection() {
    const [hostels, setHostels] = useState<any[]>([]);
    const [institutes, setInstitutes] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingHostel, setEditingHostel] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [hostelRes, instRes] = await Promise.all([
                getDocsAction({ collection: "institute_hostels", limit: 100 }),
                getDocsAction({ collection: "institutes", limit: 100 })
            ]);
            if (hostelRes.success && hostelRes.data) setHostels(hostelRes.data.docs);
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (h: any) => {
        if (!confirm(`Are you sure you want to delete this hostel?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institute_hostels", id: h.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: InstituteHostelFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = { ...data, institute_id: Number(data.institute_id) };

            const res = editingHostel 
                ? await updateDocAction({ collection: "institute_hostels", id: editingHostel.id, data: payloadData })
                : await createDocAction({ collection: "institute_hostels", data: payloadData });

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
            header: "Institute",
            cell: (h) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Home className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{h.institute_id?.name || "-"}</span>
                </div>
            )
        },
        { header: "Men Hostel", cell: (h) => <span>{h.is_men_hostel_available ? "Yes" : "No"}</span> },
        { header: "Women Hostel", cell: (h) => <span>{h.is_women_hostel_available ? "Yes" : "No"}</span> },
    ];

    return (
        <>
            <DataTable
                title="Institute Hostels"
                description="Manage hostel facilities for institutes"
                columns={columns}
                data={hostels}
                isLoading={isLoading}
                onAdd={() => { setEditingHostel(null); setIsDrawerOpen(true); }}
                onEdit={(h) => { setEditingHostel(h); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingHostel ? "Edit Hostel" : "Add Hostel"}
            >
                <InstituteHostelForm initialData={editingHostel} institutes={institutes} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
