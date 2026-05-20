"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { CounsellingForm } from "@/components/admin/forms/CounsellingForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { CounsellingFormValues } from "@/lib/validations/admin";

export function CounsellingsSection() {
    const [counsellings, setCounsellings] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCounselling, setEditingCounselling] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const query = search ? { name: { like: search } } : {};
            const [counsellingRes, stateRes, examRes] = await Promise.all([
                getDocsAction({ collection: "counsellings", limit: 100, query }),
                getDocsAction({ collection: "states", limit: 100 }),
                getDocsAction({ collection: "exams", limit: 100 })
            ]);
            
            if (counsellingRes.success && counsellingRes.data) setCounsellings(counsellingRes.data.docs);
            if (stateRes.success && stateRes.data) setStates(stateRes.data.docs);
            if (examRes.success && examRes.data) setExams(examRes.data.docs);
        } catch (error) {
            console.error("Failed to fetch counsellings", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingCounselling(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (counselling: any) => {
        setEditingCounselling(counselling);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (counselling: any) => {
        if (!confirm(`Are you sure you want to delete ${counselling.name}?`)) return;
        
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "counsellings", id: counselling.id });
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || "Failed to delete");
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: CounsellingFormValues) => {
        setIsSubmitting(true);
        try {
            let res;
            
            // Clean up state_id if 'none'
            const payloadData = { 
                ...data,
                exam_id: Number(data.exam_id)
            };
            
            if (payloadData.state_id === 'none' || !payloadData.state_id) {
                delete payloadData.state_id;
            } else {
                payloadData.state_id = Number(payloadData.state_id);
            }

            if (editingCounselling) {
                res = await updateDocAction({
                    collection: "counsellings",
                    id: editingCounselling.id,
                    data: payloadData,
                });
            } else {
                res = await createDocAction({
                    collection: "counsellings",
                    data: payloadData,
                });
            }

            if (res.success) {
                setIsDrawerOpen(false);
                await fetchData();
            } else {
                alert(res.error || "Failed to save counselling");
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
            government: "Government",
            management: "Management",
            government_and_management: "Govt & Mgmt",
        };
        return types[type] || type;
    };

    const columns: Column<any>[] = [
        {
            header: "Counselling Name",
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center">
                        <Users2 className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="font-medium text-slate-900">{c.name}</span>
                </div>
            )
        },
        {
            header: "Type",
            cell: (c) => (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {formatType(c.counselling_type)}
                </span>
            )
        },
        {
            header: "Exam",
            cell: (c) => <span className="text-sm font-medium text-slate-900">{c.exam_id?.name || "-"}</span>
        },
        {
            header: "State",
            cell: (c) => <span className="text-sm text-slate-600">{c.state_id?.name || "All India"}</span>
        }
    ];

    return (
        <>
            <DataTable
                title="Counsellings"
                description="Manage counselling bodies (e.g. MCC, KEA) and processes"
                columns={columns}
                data={counsellings}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search counsellings..."
            />

            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingCounselling ? "Edit Counselling" : "Add Counselling"}
                description={editingCounselling ? "Update counselling details below." : "Fill in the details to create a new counselling process."}
            >
                <CounsellingForm
                    initialData={editingCounselling}
                    states={states}
                    exams={exams}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            </CrudDrawer>
        </>
    );
}
