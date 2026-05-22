"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { CrudDrawer } from "@/components/admin/ui/CrudDrawer";
import { ClosingRankForm } from "@/components/admin/forms/ClosingRankForm";
import { getDocsAction, createDocAction, updateDocAction, deleteDocAction } from "@/actions/admin-crud";
import { ClosingRankFormValues } from "@/lib/validations/admin";

export function ClosingRanksSection() {
    const [ranks, setRanks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRank, setEditingRank] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async (search = "") => {
        setIsLoading(true);
        try {
            const res = await getDocsAction({ collection: "closing_ranks", limit: 100 });
            if (res.success && res.data) setRanks(res.data.docs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (r: any) => {
        if (!confirm(`Are you sure you want to delete this closing rank?`)) return;
        setIsLoading(true);
        const res = await deleteDocAction({ collection: "closing_ranks", id: r.id });
        if (res.success) await fetchData();
        else alert(res.error || "Failed to delete");
        setIsLoading(false);
    };

    const onSubmit = async (data: ClosingRankFormValues) => {
        setIsSubmitting(true);
        try {
            const res = editingRank 
                ? await updateDocAction({ collection: "closing_ranks", id: editingRank.id, data })
                : await createDocAction({ collection: "closing_ranks", data });

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
            header: "Institute & Round",
            cell: (r) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{typeof r.institute_id === 'object' ? r.institute_id?.name : 'ID: ' + r.institute_id}</div>
                        <div className="text-xs text-slate-500">Round {r.round_no}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Seat Type",
            cell: (r) => (
                <div>
                    <div className="font-medium text-slate-900">{typeof r.quota_id === 'object' ? r.quota_id?.name : 'Quota: ' + r.quota_id}</div>
                    <div className="text-xs text-slate-500">Category: {r.category}</div>
                </div>
            )
        },
        {
            header: "Rank/Score",
            cell: (r) => (
                <div>
                    <div className="font-medium text-slate-900">Rank: {r.closing_rank}</div>
                    <div className="text-xs text-slate-500">Score: {r.closing_score || 'N/A'}</div>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                title="Closing Ranks"
                description="Manage cut-offs and closing ranks"
                columns={columns}
                data={ranks}
                isLoading={isLoading}
                onAdd={() => { setEditingRank(null); setIsDrawerOpen(true); }}
                onEdit={(r) => {
                    setEditingRank({
                        ...r,
                        academic_year_id: typeof r.academic_year_id === 'object' ? r.academic_year_id?.id : r.academic_year_id,
                        counselling_id: typeof r.counselling_id === 'object' ? r.counselling_id?.id : r.counselling_id,
                        institute_id: typeof r.institute_id === 'object' ? r.institute_id?.id : r.institute_id,
                        institute_course_id: typeof r.institute_course_id === 'object' ? r.institute_course_id?.id : r.institute_course_id,
                        quota_id: typeof r.quota_id === 'object' ? r.quota_id?.id : r.quota_id,
                    }); 
                    setIsDrawerOpen(true); 
                }}
                onDelete={handleDelete}
                onSearch={fetchData}
                searchPlaceholder="Search is limited for relations..."
            />
            <CrudDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title={editingRank ? "Edit Closing Rank" : "Add Closing Rank"}
            >
                <ClosingRankForm initialData={editingRank} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CrudDrawer>
        </>
    );
}
