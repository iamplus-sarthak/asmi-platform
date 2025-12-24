"use client";

import React from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";

export function SeatMatrixTab() {
    const columns = [
        "ROUND", "QUOTA", "CATEGORY", "STATE", "INSTITUTE", "COURSE", "SEATS", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY", "STIPEND YEAR 1"
    ];

    const data = [
        ["1", "AIIMS SO", "Open", "Delhi", "AIIMS, New Delhi", "MBBS", "48", "₹1,350*", "3194", "0", "₹0", "₹30,700"],
        ["2", "AIIMS SO", "Open", "Delhi", "AIIMS, New Delhi", "MBBS", "0+3(VV)", "₹1,350*", "3194", "0", "₹0", "₹30,700"],
        ["3", "AIIMS SO", "Open", "Delhi", "AIIMS, New Delhi", "MBBS", "0+3(VV)", "₹1,350*", "3194", "0", "₹0", "₹30,700"],
    ];

    return (
        <InsightsTableLayout title="Seat Matrix" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
