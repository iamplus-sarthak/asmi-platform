import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const getLocalPayload = async () => {
    return await getPayload({ config: configPromise });
};
