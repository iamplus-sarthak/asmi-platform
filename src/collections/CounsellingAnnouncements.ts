import { CollectionConfig } from 'payload'

const CounsellingAnnouncements: CollectionConfig = {
  slug: 'counselling_announcements',
  admin: {
    useAsTitle: 'topic',
    description: 'Announcements for a counselling',
    group: 'Counselling',
  },
  fields: [
    {
      name: 'counselling_id',
      type: 'relationship',
      relationTo: 'counsellings',
      required: true,
      label: 'Counselling',
    },
    {
      name: 'topic',
      type: 'text',
      required: true,
      label: 'Topic',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'announcement_date',
      type: 'date',
      label: 'Announcement Date',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
    },
    {
      name: 'link_tag',
      type: 'text',
      label: 'Link Tag',
    },
  ],
}

export default CounsellingAnnouncements
