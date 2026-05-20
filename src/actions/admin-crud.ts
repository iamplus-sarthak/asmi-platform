'use server';

import { getLocalPayload } from '@/lib/payload';
import { revalidatePath } from 'next/cache';

// existing getDocsAction, getDocByIdAction, createDocAction, updateDocAction, deleteDocAction, uploadMediaAction...

export async function getDocsAction({
    collection,
    page = 1,
    limit = 10,
    query = {},
}: {
    collection: any;
    page?: number;
    limit?: number;
    query?: Record<string, any>;
}) {
    try {
        const payload = await getLocalPayload();
        const data = await payload.find({
            collection,
            page,
            limit,
            where: query,
        });
        return { success: true, data };
    } catch (error) {
        console.error(`Get Docs Error [${collection}]:`, error);
        return { error: `Failed to fetch data from ${collection}` };
    }
}

export async function getDocByIdAction({
    collection,
    id,
}: {
    collection: any;
    id: string | number;
}) {
    try {
        const payload = await getLocalPayload();
        const data = await payload.findByID({
            collection,
            id,
        });
        return { success: true, data };
    } catch (error) {
        console.error(`Get Doc By ID Error [${collection}]:`, error);
        return { error: `Failed to fetch document` };
    }
}

export async function createDocAction({
    collection,
    data,
    revalidateUrl,
}: {
    collection: any;
    data: any;
    revalidateUrl?: string;
}) {
    try {
        const payload = await getLocalPayload();
        const doc = await payload.create({
            collection,
            data,
        });
        
        if (revalidateUrl) {
            revalidatePath(revalidateUrl);
        }
        
        return { success: true, doc };
    } catch (error) {
        console.error(`Create Doc Error [${collection}]:`, error);
        return { error: `Failed to create document in ${collection}` };
    }
}

export async function updateDocAction({
    collection,
    id,
    data,
    revalidateUrl,
}: {
    collection: any;
    id: string | number;
    data: any;
    revalidateUrl?: string;
}) {
    try {
        const payload = await getLocalPayload();
        const doc = await payload.update({
            collection,
            id,
            data,
        });
        
        if (revalidateUrl) {
            revalidatePath(revalidateUrl);
        }
        
        return { success: true, doc };
    } catch (error) {
        console.error(`Update Doc Error [${collection}]:`, error);
        return { error: `Failed to update document in ${collection}` };
    }
}

export async function deleteDocAction({
    collection,
    id,
    revalidateUrl,
}: {
    collection: any;
    id: string | number;
    revalidateUrl?: string;
}) {
    try {
        const payload = await getLocalPayload();
        await payload.delete({
            collection,
            id,
        });
        
        if (revalidateUrl) {
            revalidatePath(revalidateUrl);
        }
        
        return { success: true };
    } catch (error) {
        console.error(`Delete Doc Error [${collection}]:`, error);
        return { error: `Failed to delete document from ${collection}` };
    }
}

export async function uploadMediaAction(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        const alt = formData.get('alt') as string || 'uploaded media';
        
        if (!file) return { error: 'No file provided' };

        const buffer = Buffer.from(await file.arrayBuffer());
        
        const payload = await getLocalPayload();
        
        const media = await payload.create({
            collection: 'media',
            data: { alt },
            file: {
                data: buffer,
                name: file.name,
                mimetype: file.type,
                size: file.size,
            },
        });
        
        return { success: true, media };
    } catch (error) {
        console.error('Upload Media Error:', error);
        return { error: 'Failed to upload media' };
    }
}


// --- Complex Institute Operations ---

export async function saveInstituteComplexAction(data: any, existingId?: number | string) {
    try {
        const payload = await getLocalPayload();
        
        // 1. Separate base fields from relations
        const { address, contact_persons, images, ...baseInstituteData } = data;
        
        let instituteId = existingId;
        
        // 2. Create or Update Base Institute
        if (instituteId) {
            await payload.update({
                collection: 'institutes',
                id: instituteId,
                data: baseInstituteData
            });
        } else {
            const newInst = await payload.create({
                collection: 'institutes',
                data: baseInstituteData
            });
            instituteId = newInst.id;
        }

        // 3. Handle Address
        if (address && Object.keys(address).length > 0) {
            const addressData = { ...address, institute_id: instituteId };
            if (address.state_id) addressData.state_id = Number(address.state_id);

            if (address.id) {
                await payload.update({ collection: 'institute_address', id: address.id, data: addressData });
            } else {
                await payload.create({ collection: 'institute_address', data: addressData });
            }
        }

        // 4. Handle Contacts
        // Delete old ones first if editing to avoid managing diffs
        if (existingId) {
            const oldContacts = await payload.find({ collection: 'institute_contact_persons', where: { institute_id: { equals: existingId } }});
            for (const doc of oldContacts.docs) {
                await payload.delete({ collection: 'institute_contact_persons', id: doc.id });
            }
        }
        if (contact_persons && contact_persons.length > 0) {
            for (const contact of contact_persons) {
                const { id, ...contactData } = contact; // remove client side temp id
                await payload.create({ collection: 'institute_contact_persons', data: { ...contactData, institute_id: instituteId } });
            }
        }

        // 5. Handle Images
        if (existingId) {
            const oldImages = await payload.find({ collection: 'institute_images', where: { institute_id: { equals: existingId } }});
            for (const doc of oldImages.docs) {
                await payload.delete({ collection: 'institute_images', id: doc.id });
            }
        }
        if (images && images.length > 0) {
            for (const img of images) {
                const { id, file, ...imgData } = img;
                await payload.create({ collection: 'institute_images', data: { ...imgData, institute_id: instituteId } });
            }
        }

        return { success: true, id: instituteId };
    } catch (error) {
        console.error('Complex Institute Save Error:', error);
        return { error: 'Failed to save institute complex data' };
    }
}

export async function getInstituteComplexAction(instituteId: string | number) {
    try {
        const payload = await getLocalPayload();
        
        // Parallel fetch of relations
        const [addressRes, contactsRes, imagesRes] = await Promise.all([
            payload.find({ collection: 'institute_address', where: { institute_id: { equals: instituteId } }, limit: 1 }),
            payload.find({ collection: 'institute_contact_persons', where: { institute_id: { equals: instituteId } }, limit: 100 }),
            payload.find({ collection: 'institute_images', where: { institute_id: { equals: instituteId } }, limit: 100 })
        ]);

        return { 
            success: true, 
            data: {
                address: addressRes.docs[0] || null,
                contact_persons: contactsRes.docs || [],
                images: imagesRes.docs || []
            } 
        };
    } catch (error) {
        console.error('Complex Institute Fetch Error:', error);
        return { error: 'Failed to fetch institute complex data' };
    }
}
