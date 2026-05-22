"use client";

import React, { useEffect, useState } from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";
import { getFeesAction } from "@/actions/student-insights";
import { Loader2 } from "lucide-react";

export function FeeStipendBondTab() {
    const columns = [
        "STATE", "INSTITUTE", "COURSE", "QUOTA", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY", "STIPEND YEAR 1"
    ];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            const res = await getFeesAction();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        fetchFees();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <InsightsTableLayout title="Fee, Stipend and Bond" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
