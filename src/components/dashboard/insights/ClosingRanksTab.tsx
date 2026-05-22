"use client";

import React, { useEffect, useState } from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";
import { getClosingRanksAction } from "@/actions/student-insights";
import { Loader2 } from "lucide-react";

export function ClosingRanksTab() {
    const columns = [
        "ROUND", "INSTITUTE", "COURSE", "QUOTA", "CATEGORY", "CLOSING RANK", "CLOSING SCORE"
    ];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClosingRanks = async () => {
            const res = await getClosingRanksAction();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        fetchClosingRanks();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <InsightsTableLayout title="Closing Ranks" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
