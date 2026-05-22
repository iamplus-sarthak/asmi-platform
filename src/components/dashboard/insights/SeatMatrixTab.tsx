"use client";

import React, { useEffect, useState } from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";
import { getSeatMatrixAction } from "@/actions/student-insights";
import { Loader2 } from "lucide-react";

export function SeatMatrixTab() {
    const columns = [
        "STATE", "INSTITUTE", "COURSE", "QUOTA", "CATEGORY", "SEATS", "REMARKS"
    ];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeatMatrix = async () => {
            const res = await getSeatMatrixAction();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        fetchSeatMatrix();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <InsightsTableLayout title="Seat Matrix" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
