"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { InstituteForm } from "@/components/admin/forms/InstituteForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction, saveInstituteComplexAction, getInstituteComplexAction } from "@/actions/admin-crud";
import { InstituteFormValues } from "@/lib/validations/admin";

export function InstitutesSection() {
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [instituteTypes, setInstituteTypes] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingInstitute, setEditingInstitute] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const [instRes, stateRes, uniRes, typeRes] = await Promise.all([
                getDocsAction({ collection: "institutes", limit: 100, query }),
                getDocsAction({ collection: "states", limit: 100 }),
                getDocsAction({ collection: "universities", limit: 100 }),
                getDocsAction({ collection: "institute_types", limit: 50 })
            ]);
            
            if (instRes.success && instRes.data) setInstitutes(instRes.data.docs);
            if (stateRes.success && stateRes.data) setStates(stateRes.data.docs);
            if (uniRes.success && uniRes.data) setUniversities(uniRes.data.docs);
            if (typeRes.success && typeRes.data) setInstituteTypes(typeRes.data.docs);
        } catch (error) {
            console.error("Failed to fetch institutes", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingInstitute(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = async (inst: any) => {
        setIsLoading(true);
        try {
            const relRes = await getInstituteComplexAction(inst.id);
            if (relRes.success && relRes.data) {
                setEditingInstitute({
                    ...inst,
                    address: relRes.data.address,
                    contact_persons: relRes.data.contact_persons,
                    images: relRes.data.images,
                });
            } else {
                setEditingInstitute(inst); // fallback
            }
        } catch (err) {
            console.error(err);
            setEditingInstitute(inst);
        }
        setIsLoading(false);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (inst: any) => {
        if (!confirm(`Are you sure you want to delete ${inst.name}?`)) return;
        
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "institutes", id: inst.id });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to delete");
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: InstituteFormValues) => {
        setIsSubmitting(true);
        try {
            const payloadData = {
                ...data,
                institute_type_id: Number(data.institute_type_id),
                state_id: data.state_id ? Number(data.state_id) : undefined,
                university_id: data.university_id ? Number(data.university_id) : undefined,
            };

            const res = await saveInstituteComplexAction(payloadData, editingInstitute?.id);

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save institute");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<any>[] = [
        {
            header: "Institute Name",
            cell: (inst) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-slate-900">{inst.name}</span>
                </div>
            )
        },
        {
            header: "Short Name",
            accessorKey: "short_name",
        },
        {
            header: "Type",
            cell: (inst) => (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {inst.institute_type_id?.name || "-"}
                </span>
            )
        },
        {
            header: "State",
            cell: (inst) => <span className="text-sm text-slate-600">{inst.state_id?.name || "-"}</span>
        },
        {
            header: "University",
            cell: (inst) => <span className="text-sm text-slate-600 truncate max-w-[150px] inline-block">{inst.university_id?.name || "-"}</span>
        }
    ];

    return (
        <>
            <DataTable
                title="Institutes"
                description="Manage medical institutes and colleges"
                columns={columns}
                data={institutes}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search institutes..."
            />

            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingInstitute ? "Edit Institute" : "Add Institute"}
                description={editingInstitute ? "Update institute details below." : "Fill in the details to create a new institute."}
            >
                <InstituteForm
                    initialData={editingInstitute}
                    instituteTypes={instituteTypes}
                    states={states}
                    universities={universities}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </>
    );
}
