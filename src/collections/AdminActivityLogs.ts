import { CollectionConfig } from 'payload'

export const AdminActivityLogs: CollectionConfig = {
  slug: 'admin_activity_logs',
  admin: {
    useAsTitle: 'action',
    description: 'Auto-generated logs for admin activity',
    group: 'Analytics',
    defaultColumns: ['action', 'user_name', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true, // Allows hooks to create logs
  },
  fields: [
    {
      name: 'action',
      type: 'text',
      required: true,
      label: 'Action Performed',
    },
    {
      name: 'user_name',
      type: 'text',
      required: true,
      label: 'User Name',
    },
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'resource_collection',
      type: 'text',
      required: false,
    },
    {
      name: 'resource_id',
      type: 'text',
      required: false,
    },
  ],
}

export default AdminActivityLogs
