"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteTypeForm } from "@/components/admin/forms/InstituteTypeForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { InstituteTypeFormValues } from "@/lib/validations/admin";

export function InstituteTypesSection() {
    const [types, setTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingType, setEditingType] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const res = await getDocsAction({ collection: "institute_types", limit: 100, query });
            if (res.success && res.data) setTypes(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (t: any) => {
        if (!confirm(`Are you sure you want to delete ${t.name}?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institute_types", id: t.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: InstituteTypeFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingType 
                ? await updateDocAction({ collection: "institute_types", id: editingType.id, data })
                : await createDocAction({ collection: "institute_types", data });

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
            header: "Name",
            cell: (t) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="font-medium text-slate-900">{t.name}</span>
                </div>
            )
        },
        { header: "Description", accessorKey: "description" },
    ];

    return (
        <>
            <DataTable
                title="Institute Types"
                description="Manage classifications for medical institutes"
                columns={columns}
                data={types}
                isLoading={isLoading}
                onAdd={() => { setEditingType(null); setIsDrawerOpen(true); }}
                onEdit={(t) => { setEditingType(t); setIsDrawerOpen(true); }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search types..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingType ? "Edit Type" : "Add Type"}
            >
                <InstituteTypeForm initialData={editingType} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
