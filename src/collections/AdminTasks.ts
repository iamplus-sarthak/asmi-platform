import { CollectionConfig } from 'payload'

export const AdminTasks: CollectionConfig = {
  slug: 'admin_tasks',
  admin: {
    useAsTitle: 'task',
    description: 'Tasks for admin dashboard',
    group: 'Analytics',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'task',
      type: 'text',
      required: true,
      label: 'Task Description',
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
      label: 'Priority',
    },
    {
      name: 'is_completed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Completed',
    },
  ],
}

export default AdminTasks
