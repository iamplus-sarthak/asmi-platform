"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { UniversityForm } from "@/components/admin/forms/UniversityForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { UniversityFormValues } from "@/lib/validations/admin";

export function UniversitiesSection() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const [uniRes, stateRes] = await Promise.all([
                getDocsAction({ collection: "universities", limit: 100, query }),
                getDocsAction({ collection: "states", limit: 100 })
            ]);
            
            if (uniRes.success && uniRes.data) {
                setUniversities(uniRes.data.docs);
            }
            if (stateRes.success && stateRes.data) {
                setStates(stateRes.data.docs);
            }
        } catch (error) {
            console.error("Failed to fetch universities", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingUniversity(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (uni: any) => {
        setEditingUniversity(uni);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (uni: any) => {
        if (!confirm(`Are you sure you want to delete ${uni.name}?`)) return;
        
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "universities", id: uni.id });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to delete");
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: UniversityFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = {
                ...data,
                state_id: Number(data.state_id),
            };

            let res;
            if (editingUniversity) {
                res = await updateDocAction({
                    collection: "universities",
                    id: editingUniversity.id,
                    data: payloadData,
                });
            } else {
                res = await createDocAction({
                    collection: "universities",
                    data: payloadData,
                });
            }

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save university");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatType = (type: string) => {
        const types: Record<string, string> = {
            central: "Central",
            deemed: "Deemed",
            state_govt: "State Government",
            state_private: "State Private"
        };
        return types[type] || type;
    };

    const columns: Column<any>[] = [
        {
            header: "University Name",
            cell: (uni) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-900">{uni.name}</span>
                </div>
            )
        },
        {
            header: "Type",
            cell: (uni) => (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${uni.university_type === "central" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                    {formatType(uni.university_type)}
                </span>
            )
        },
        {
            header: "State",
            cell: (uni) => <span className="text-sm text-slate-600">{uni.state_id?.name || "-"}</span>
        }
    ];

    return (
        <>
            <DataTable
                title="Universities"
                description="Manage universities and their affiliated institutes"
                columns={columns}
                data={universities}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search universities..."
            />

            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingUniversity ? "Edit University" : "Add University"}
                description={editingUniversity ? "Update university details below." : "Fill in the details to create a new university."}
            >
                <UniversityForm
                    initialData={editingUniversity}
                    states={states}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </>
    );
}
