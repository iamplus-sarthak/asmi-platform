"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";

function getStr(obj: any, key: string, fallback = "N/A"): string {
    if (!obj) return fallback;
    if (typeof obj === "string") return obj; // if it's an ID
    if (obj[key] !== undefined && obj[key] !== null) return obj[key].toString();
    return fallback;
}

export async function getAllotmentsAction() {
    try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
            collection: "allotments",
            limit: 50,
            depth: 2, // resolve relations
        });

        const formatted = res.docs.map(doc => {
            return [
                getStr(doc, "round_no"),
                getStr(doc, "ai_rank"),
                getStr(doc.institute_id, "state_id") === "N/A" ? "N/A" : getStr(doc.institute_id?.state_id, "name"), // state name from institute -> state_id
                getStr(doc.institute_id, "name"),
                getStr(doc.institute_course_id, "course_id") === "N/A" ? "N/A" : getStr(doc.institute_course_id?.course_id, "name"),
                getStr(doc.quota_id, "name"),
                getStr(doc, "category"),
                "₹0", // mock fee
                getStr(doc.institute_id, "description", "").replace("Beds: ", ""), // mock beds
                "0", // mock bond years
                "₹0", // mock bond penalty
            ];
        });
        return { success: true, data: formatted };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function getClosingRanksAction() {
    try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
            collection: "closing_ranks",
            limit: 50,
            depth: 2,
        });

        const formatted = res.docs.map(doc => {
            return [
                getStr(doc, "round_no"),
                getStr(doc.institute_id, "name"),
                getStr(doc.institute_course_id, "course_id") === "N/A" ? "N/A" : getStr(doc.institute_course_id?.course_id, "name"),
                getStr(doc.quota_id, "name"),
                getStr(doc, "category"),
                getStr(doc, "closing_rank"),
                getStr(doc, "closing_score"),
            ];
        });
        return { success: true, data: formatted };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function getSeatMatrixAction() {
    try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
            collection: "seat_matrix",
            limit: 50,
            depth: 2,
        });

        const formatted = res.docs.map(doc => {
            return [
                getStr(doc.institute_id, "state_id") === "N/A" ? "N/A" : getStr(doc.institute_id?.state_id, "name"), // state
                getStr(doc.institute_id, "name"),
                getStr(doc.institute_course_id, "course_id") === "N/A" ? "N/A" : getStr(doc.institute_course_id?.course_id, "name"),
                getStr(doc.quota_id, "name"),
                getStr(doc, "category"),
                getStr(doc, "total_seats"),
                getStr(doc, "seats_remarks", "-"),
            ];
        });
        return { success: true, data: formatted };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function getFeesAction() {
    try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
            collection: "institute_course_fees",
            limit: 50,
            depth: 3,
        });

        const formatted = res.docs.map(doc => {
            // we need state from institute_course -> institute -> state
            const inst = doc.institute_course_id?.institute_id;
            const state = inst?.state_id?.name || "N/A";
            const instName = inst?.name || "N/A";
            const courseName = doc.institute_course_id?.course_id?.name || "N/A";

            return [
                state,
                instName,
                courseName,
                getStr(doc.quota_id, "name"),
                `₹${getStr(doc, "annual_fee")}`,
                getStr(inst, "description", "").replace("Beds: ", "") || "Info Not Available",
                getStr(doc, "bond_years"),
                `₹${getStr(doc, "bond_penalty_amount")}`,
                `₹${getStr(doc, "stipend_year_1")}`,
            ];
        });
        return { success: true, data: formatted };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}
