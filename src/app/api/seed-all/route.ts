import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const payload = await getPayload({ config: configPromise });

        console.log("Seeding process started...");

        // 1. Core Configs
        let ay = (await payload.find({ collection: 'academic_years', where: { year: { equals: '2024-25' } } })).docs[0];
        if (!ay) ay = await payload.create({ collection: 'academic_years', data: { year: '2024-25' } });

        let exam = (await payload.find({ collection: 'exams', where: { name: { equals: 'NEET UG' } } })).docs[0];
        if (!exam) exam = await payload.create({ collection: 'exams', data: { name: 'NEET UG', short_name: 'NEET', description: 'UG Medical Exam' } });

        let course = (await payload.find({ collection: 'courses', where: { name: { equals: 'MBBS' } } })).docs[0];
        if (!course) course = await payload.create({ collection: 'courses', data: { name: 'MBBS', duration: '5.5 years', course_type: 'clinical', degree_type: 'medical' } });

        const states = ['Delhi', 'Uttar Pradesh', 'Gujarat'];
        const stateIds: Record<string, string | number> = {};
        for (const s of states) {
            let st = (await payload.find({ collection: 'states', where: { name: { equals: s } } })).docs[0];
            if (!st) st = await payload.create({ collection: 'states', data: { name: s, code: s.substring(0, 2).toUpperCase(), type: 'state' } });
            stateIds[s] = st.id;
        }

        // 2. Counselling & Quotas
        let counselling = (await payload.find({ collection: 'counsellings', where: { name: { equals: 'All India UG - Medical & Dental' } } })).docs[0];
        if (!counselling) counselling = await payload.create({ collection: 'counsellings', data: { name: 'All India UG - Medical & Dental', counselling_type: 'government', exam_id: exam.id } });

        const quotas = ['AIIMS SO', 'AI', 'State Quota', 'NRI'];
        const quotaIds: Record<string, string | number> = {};
        for (const q of quotas) {
            let qt = (await payload.find({ collection: 'counselling_quotas', where: { name: { equals: q } } })).docs[0];
            if (!qt) qt = await payload.create({ collection: 'counselling_quotas', data: { name: q, counselling_id: counselling.id } });
            quotaIds[q] = qt.id;
        }

        // 3. Institute Types
        let typeGovt = (await payload.find({ collection: 'institute_types', where: { name: { equals: 'Government' } } })).docs[0];
        if (!typeGovt) typeGovt = await payload.create({ collection: 'institute_types', data: { name: 'Government' } });

        // 4. Institutes & Courses
        const institutesData = [
            { name: 'AIIMS, New Delhi', short: 'AIIMS Delhi', state: 'Delhi', beds: 3194 },
            { name: 'MAMC, New Delhi', short: 'MAMC', state: 'Delhi', beds: 2500 },
            { name: 'VMMC, New Delhi', short: 'VMMC', state: 'Delhi', beds: 1800 },
            { name: 'ESIC MedCollHosp, Noida', short: 'ESIC Noida', state: 'Uttar Pradesh', beds: 500 },
            { name: 'ESIC Med Coll, Naroda', short: 'ESIC Naroda', state: 'Gujarat', beds: 400 },
        ];

        const instIds: Record<string, string | number> = {};
        const instCourseIds: Record<string, string | number> = {};

        for (const inst of institutesData) {
            let iDoc = (await payload.find({ collection: 'institutes', where: { name: { equals: inst.name } } })).docs[0];
            if (!iDoc) iDoc = await payload.create({ collection: 'institutes', data: { name: inst.name, short_name: inst.short, institute_type_id: typeGovt.id, authority_type: 'central', state_id: stateIds[inst.state], description: `Beds: ${inst.beds}` } });
            instIds[inst.name] = iDoc.id;

            let icDoc = (await payload.find({ collection: 'institute_courses', where: { institute_id: { equals: iDoc.id } } })).docs[0];
            if (!icDoc) icDoc = await payload.create({ collection: 'institute_courses', data: { label: `${inst.short} - MBBS`, institute_id: iDoc.id, course_id: course.id, total_seats: 100 } });
            instCourseIds[inst.name] = icDoc.id;
        }

        // 5. Seed Fees
        const feeCount = await payload.find({ collection: 'institute_course_fees', limit: 1 });
        if (feeCount.totalDocs === 0) {
            const fees = [
                { inst: 'AIIMS, New Delhi', quota: 'AIIMS SO', fee: 1350, bond_years: 0, penalty: 0, stipend: 30700 },
                { inst: 'MAMC, New Delhi', quota: 'AI', fee: 2095, bond_years: 1, penalty: 1500000, stipend: 23000 },
                { inst: 'VMMC, New Delhi', quota: 'AI', fee: 2500, bond_years: 1, penalty: 1500000, stipend: 23000 },
                { inst: 'ESIC MedCollHosp, Noida', quota: 'AI', fee: 100000, bond_years: 1, penalty: 500000, stipend: 26300 },
                { inst: 'ESIC Med Coll, Naroda', quota: 'AI', fee: 100000, bond_years: 1, penalty: 500000, stipend: 26300 }
            ];
            for (const f of fees) {
                await payload.create({ collection: 'institute_course_fees', data: { institute_course_id: instCourseIds[f.inst], counselling_id: counselling.id, quota_id: quotaIds[f.quota], academic_year_id: ay.id, annual_fee: f.fee, stipend_year_1: f.stipend, bond_years: f.bond_years, bond_penalty_amount: f.penalty } });
            }
        }

        // 6. Seed Allotments
        const allotmentsCount = await payload.find({ collection: 'allotments', limit: 1 });
        if (allotmentsCount.totalDocs === 0) {
            for (let r = 1; r <= 3; r++) {
                for (let i = 1; i <= 5; i++) {
                    await payload.create({ collection: 'allotments', data: { year: '2024-25', round_no: r, counselling_id: counselling.id, institute_id: instIds['AIIMS, New Delhi'], institute_course_id: instCourseIds['AIIMS, New Delhi'], quota_id: quotaIds['AIIMS SO'], category: 'Open', ai_rank: i + (r * 10), state_rank: i + (r * 5) } });
                    await payload.create({ collection: 'allotments', data: { year: '2024-25', round_no: r, counselling_id: counselling.id, institute_id: instIds['MAMC, New Delhi'], institute_course_id: instCourseIds['MAMC, New Delhi'], quota_id: quotaIds['AI'], category: 'OBC', ai_rank: i + 50 + (r * 10), state_rank: i + 20 + (r * 5) } });
                }
            }
        }

        // 7. Seed Closing Ranks
        const crCount = await payload.find({ collection: 'closing_ranks', limit: 1 });
        if (crCount.totalDocs === 0) {
            const ranks = [
                { inst: 'AIIMS, New Delhi', quota: 'AIIMS SO', cat: 'Open', cr: 55, score: 710 },
                { inst: 'MAMC, New Delhi', quota: 'AI', cat: 'Open', cr: 91, score: 705 },
                { inst: 'VMMC, New Delhi', quota: 'AI', cat: 'OBC', cr: 129, score: 700 },
                { inst: 'ESIC MedCollHosp, Noida', quota: 'State Quota', cat: 'SC', cr: 250, score: 680 },
                { inst: 'ESIC Med Coll, Naroda', quota: 'AI', cat: 'ST', cr: 400, score: 650 }
            ];
            for (let r = 1; r <= 2; r++) {
                for (const item of ranks) {
                    await payload.create({ collection: 'closing_ranks', data: { academic_year_id: ay.id, counselling_id: counselling.id, institute_id: instIds[item.inst], institute_course_id: instCourseIds[item.inst], quota_id: quotaIds[item.quota], category: item.cat, round_no: r, closing_rank: item.cr + (r * 15), closing_score: item.score - (r * 2) } });
                }
            }
        }

        // 8. Seed Seat Matrix
        const smCount = await payload.find({ collection: 'seat_matrix', limit: 1 });
        if (smCount.totalDocs === 0) {
            const matrices = [
                { inst: 'AIIMS, New Delhi', quota: 'AIIMS SO', cat: 'Open', seats: 48, rem: '0+3(VV)' },
                { inst: 'AIIMS, New Delhi', quota: 'AIIMS SO', cat: 'OBC', seats: 32, rem: '' },
                { inst: 'MAMC, New Delhi', quota: 'AI', cat: 'Open', seats: 45, rem: '' },
                { inst: 'VMMC, New Delhi', quota: 'AI', cat: 'OBC', seats: 20, rem: 'PwD 1' }
            ];
            for (const item of matrices) {
                await payload.create({ collection: 'seat_matrix', data: { academic_year_id: ay.id, counselling_id: counselling.id, institute_id: instIds[item.inst], institute_course_id: instCourseIds[item.inst], quota_id: quotaIds[item.quota], category: item.cat, round_no: 1, total_seats: item.seats, seats_remarks: item.rem } });
            }
        }

        console.log("Seeding process completed!");
        return NextResponse.json({ success: true, message: 'Extensive seeding completed successfully' });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
