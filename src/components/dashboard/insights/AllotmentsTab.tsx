"use client";

import React, { useEffect, useState } from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";
import { getAllotmentsAction } from "@/actions/student-insights";
import { Loader2 } from "lucide-react";

export function AllotmentsTab() {
    const columns = [
        "ROUND", "AI RANK", "STATE", "INSTITUTE", "COURSE", "QUOTA", "CATEGORY", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY"
    ];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllotments = async () => {
            const res = await getAllotmentsAction();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        fetchAllotments();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <InsightsTableLayout title="Allotments" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
