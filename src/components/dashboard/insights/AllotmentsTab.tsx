"use client";

import React from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";

export function AllotmentsTab() {
    const columns = [
        "ROUND", "AI RANK", "STATE", "INSTITUTE", "COURSE", "QUOTA", "CATEGORY", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY"
    ];

    const data = [
        ["1", "1", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
        ["1", "2", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
        ["1", "3", "Delhi", "AIIMS, New Delhi", "MBBS", "AIIMS SO", "Open", "₹1,350*", "3194", "0", "₹0"],
    ];

    return (
        <InsightsTableLayout title="Allotments" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
