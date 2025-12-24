"use client";

import React from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";

export function ClosingRanksTab() {
    const columns = [
        "QUOTA", "CATEGORY", "STATE", "INSTITUTE", "COURSE", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY", "STIPEND YEAR 1", "CR 2022 1", "CR 2022 2"
    ];

    const data = [
        ["AIIMS SO", "Open", "Delhi", "AIIMS, New Delhi", "MBBS", "₹1,350*", "3194", "0", "₹0", "₹30,700", "55(48)", "61(48)"],
        ["AI", "Open", "Delhi", "MAMC, New Delhi", "MBBS", "₹2,095*", "2800", "1", "₹15,00,000", "₹23,000", "91(14)", "107(14)"],
        ["AI", "Open", "Delhi", "VMMC, New Delhi", "MBBS", "₹41,000*", "1550", "1", "₹15,00,000", "₹26,300", "129(10)", "129(10)"],
    ];

    return (
        <InsightsTableLayout title="Closing Ranks" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
