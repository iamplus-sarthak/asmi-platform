import { CollectionConfig } from 'payload'

const CounsellingTimelines: CollectionConfig = {
  slug: 'counselling_timelines',
  admin: {
    useAsTitle: 'title',
    description: 'Timeline events for a counselling',
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
    },
    {
      name: 'event_date',
      type: 'date',
      required: true,
      label: 'Event Date',
    },
  ],
}

export default CounsellingTimelines
