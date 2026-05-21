'use server';

import { cookies } from 'next/headers';
import { getLocalPayload } from '@/lib/payload';
import jwt from 'jsonwebtoken';

export async function sendOtpAction(mobile: string) {
    if (!mobile) return { error: 'Mobile required' };

    try {
        const payload = await getLocalPayload();
        
        let users = await payload.find({
            collection: 'users',
            where: { phone_number: { equals: mobile } },
            limit: 1,
        });

        let user = users.docs[0];
        if (!user) {
            const studentRole = await payload.find({
                collection: 'roles',
                where: { name: { equals: 'student' } },
                limit: 1,
            });
            const studentRoleId = studentRole.docs[0]?.id;

            user = await payload.create({
                collection: 'users',
                data: {
                    phone_number: mobile,
                    email: `${mobile}@placeholder.asmi`,
                    password: Math.random().toString(36).slice(-8),
                    roleid: studentRoleId,
                    onboarding_completed: false,
                } as any,
            });
        }

        const otp = '1234'; // Hardcoded for now, as in the original implementation
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await payload.create({
            collection: 'user_otps',
            data: {
                user_id: user.id,
                otp_code: otp,
                purpose: 'login',
                expires_at: expiresAt.toISOString(),
                is_used: false,
            } as any,
        });

        return { success: true };
    } catch (error) {
        console.error('Send OTP Error:', error);
        return { error: 'Failed to send OTP' };
    }
}

export async function verifyOtpAction(mobile: string, otp: string) {
    if (!mobile || !otp) return { error: 'Mobile and OTP required' };

    try {
        const payload = await getLocalPayload();
        
        const users = await payload.find({
            collection: 'users',
            where: { phone_number: { equals: mobile } },
            limit: 1,
        });

        const user = users.docs[0];
        if (!user) return { error: 'User not found' };

        const otps = await payload.find({
            collection: 'user_otps',
            where: {
                user_id: { equals: user.id },
                otp_code: { equals: otp },
                is_used: { equals: false },
                expires_at: { greater_than: new Date().toISOString() },
            },
            sort: '-createdAt',
            limit: 1,
        });

        const validOtp = otps.docs[0];
        if (!validOtp) return { error: 'Invalid or expired OTP' };

        await payload.update({
            collection: 'user_otps',
            id: validOtp.id,
            data: { is_used: true },
        });

        await payload.update({
            collection: 'users',
            id: user.id,
            data: { last_login_at: new Date().toISOString() } as any,
        });

        const roleName = typeof user.roleid === 'object' && user.roleid !== null
            ? (user.roleid as any).name?.toLowerCase()
            : 'student';

        // Generate JWT
        const fieldsToSign = {
            email: user.email,
            id: user.id,
            role: roleName,
            collection: 'users',
        };
        
        // Use process.env.PAYLOAD_SECRET instead of payload.secret since payload.secret isn't exposed properly without init
        const secret = process.env.PAYLOAD_SECRET || '';
        const token = jwt.sign(fieldsToSign, secret, {
            expiresIn: 7200, // 2 hours
        });

        const cookieStore = await cookies();
        cookieStore.set('payload-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7200,
            path: '/',
        });

        return {
            success: true,
            user,
            role: roleName,
            isNewUser: !user.onboarding_completed,
        };
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return { error: 'Failed to verify OTP' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('payload-token');
    return { success: true };
}

export async function getSessionAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('payload-token')?.value;

        if (!token) return { user: null };

        const secret = process.env.PAYLOAD_SECRET || '';
        const decoded = jwt.verify(token, secret) as any;

        const payload = await getLocalPayload();
        const user = await payload.findByID({
            collection: 'users',
            id: decoded.id,
        });

        return { user };
    } catch (error) {
        console.error('Get Session Error:', error);
        return { user: null };
    }
}
