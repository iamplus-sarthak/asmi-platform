'use server';

import { getLocalPayload } from '@/lib/payload';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;
    if (!token) return null;
    try {
        const secret = process.env.PAYLOAD_SECRET || '';
        const decoded = jwt.verify(token, secret) as any;
        return decoded.id;
    } catch {
        return null;
    }
}

export async function createStudentProfileAction(data: {
    fullName: string;
    email: string;
    phone: string;
    currentClass: string;
    exam: string;
    state: string;
}) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) return { error: 'Unauthorized' };

        const payload = await getLocalPayload();
        
        // Find state and exam IDs based on slugs if needed, or pass directly
        // For simplicity, assuming data.exam and data.state are just strings (or need to be mapped to relationships)
        // In the original REST call, it just passed them as strings or didn't pass state/exam in creation
        // Wait, original call only passed full_name, email, phone_number, current_class, user_id
        
        const student = await payload.create({
            collection: 'students',
            data: {
                full_name: data.fullName,
                email: data.email,
                phone_number: data.phone,
                current_class: data.currentClass,
                user_id: userId,
                // state_id and prefferd_exam_id mapping can go here if needed
            } as any,
        });

        // Update user to link student profile and mark onboarding as complete
        await payload.update({
            collection: 'users',
            id: userId,
            data: {
                onboarding_completed: true,
                entity_id: {
                    relationTo: 'students',
                    value: student.id,
                }
            } as any,
        });

        return { success: true, student };
    } catch (error) {
        console.error('Create Profile Error:', error);
        return { error: 'Failed to create profile' };
    }
}

export async function updateStudentProfileAction(studentId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    currentClass: string;
}) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) return { error: 'Unauthorized' };

        const payload = await getLocalPayload();
        
        // Ensure this student belongs to this user
        const student = await payload.findByID({
            collection: 'students',
            id: studentId,
        });

        // The relation to user_id might be a string or object depending on payload config
        const studentUserId = typeof student.user_id === 'object' ? (student.user_id as any).id : student.user_id;
        if (studentUserId !== userId) {
            return { error: 'Forbidden' };
        }

        const updatedStudent = await payload.update({
            collection: 'students',
            id: studentId,
            data: {
                full_name: data.fullName,
                email: data.email,
                phone_number: data.phone,
                current_class: data.currentClass,
            } as any,
        });

        return { success: true, student: updatedStudent };
    } catch (error) {
        console.error('Update Profile Error:', error);
        return { error: 'Failed to update profile' };
    }
}

export async function getStudentProfileAction(userId: string) {
    try {
        const payload = await getLocalPayload();
        
        const students = await payload.find({
            collection: 'students',
            where: { user_id: { equals: userId } },
            limit: 1,
        });

        return { student: students.docs[0] || null };
    } catch (error) {
        console.error('Get Profile Error:', error);
        return { student: null };
    }
}
