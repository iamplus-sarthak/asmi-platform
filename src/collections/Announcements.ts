import { CollectionConfig } from 'payload'

const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    description: 'General system announcements and updates',
    group: 'Content Management',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'announcement_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Quick Update', value: 'quick' },
        { label: 'Event Notice', value: 'event' },
        { label: 'General Announcement', value: 'general' },
      ],
      defaultValue: 'general',
      label: 'Announcement Type',
    },
    {
      name: 'target_audience',
      type: 'select',
      required: true,
      options: [
        { label: 'All Students', value: 'all' },
        { label: 'NEET Students', value: 'neet' },
        { label: 'JEE Students', value: 'jee' },
      ],
      defaultValue: 'all',
      label: 'Target Audience',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'draft',
      label: 'Status',
    },
    {
      name: 'scheduled_date',
      type: 'date',
      label: 'Scheduled Date (if applicable)',
      admin: {
        condition: (data) => data.status === 'scheduled',
      }
    },
  ],
}

export default Announcements
