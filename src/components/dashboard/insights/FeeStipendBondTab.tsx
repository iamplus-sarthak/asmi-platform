"use client";

import React from "react";
import { InsightsTableLayout, TableRow } from "./InsightsTableLayout";

export function FeeStipendBondTab() {
    const columns = [
        "STATE", "INSTITUTE", "COURSE", "QUOTA", "FEE", "BEDS", "BOND YEARS", "BOND PENALTY", "STIPEND YEAR 1"
    ];

    const data = [
        ["Delhi", "ESI, Basaidarpur, Delhi", "MBBS", "AI", "₹1,00,000*", "Info Not Available", "1", "₹5,00,000", "₹26,300"],
        ["Uttar Pradesh", "ESIC MedCollHosp, Noida", "MBBS", "AI", "₹1,00,000*", "Info Not Available", "1", "₹5,00,000", "₹26,300"],
        ["Gujarat", "ESIC Med Coll, Naroda", "MBBS", "AI", "₹1,00,000*", "Info Not Available", "1", "₹5,00,000", "₹26,300"],
    ];

    return (
        <InsightsTableLayout title="Fee, Stipend and Bond" columns={columns}>
            {data.map((row, i) => (
                <TableRow key={i} data={row} />
            ))}
        </InsightsTableLayout>
    );
}
