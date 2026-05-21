import { CollectionConfig } from 'payload'

const SupportTickets: CollectionConfig = {
  slug: 'support_tickets',
  admin: {
    useAsTitle: 'subject',
    description: 'Support tickets raised by users',
    group: 'Support',
  },
  fields: [
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject',
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      label: 'Priority',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
      label: 'Status',
    },
    {
      name: 'is_read_admin',
      type: 'checkbox',
      defaultValue: false,
      label: 'Read by Admin',
    },
    {
      name: 'is_read_user',
      type: 'checkbox',
      defaultValue: true,
      label: 'Read by User',
    },
    {
      name: 'messages',
      type: 'array',
      label: 'Messages',
      fields: [
        {
          name: 'sender_type',
          type: 'select',
          required: true,
          options: [
            { label: 'User', value: 'user' },
            { label: 'Admin', value: 'admin' },
          ],
        },
        {
          name: 'sender_id',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
        {
          name: 'is_internal',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'sent_at',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
}

export default SupportTickets
