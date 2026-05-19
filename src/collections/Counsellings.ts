import { CollectionConfig } from 'payload'

const Counsellings: CollectionConfig = {
  slug: 'counsellings',
  admin: {
    useAsTitle: 'name',
    description: 'Counselling bodies like MCC, KEA, UPGDME, etc.',
    group: 'Counselling',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Counselling Name',
      // e.g. MCC, KEA, UPGDME
    },
    {
      name: 'counselling_type',
      type: 'select',
      required: true,
      label: 'Counselling Type',
      options: [
        { label: 'Government', value: 'government' },
        { label: 'Management', value: 'management' },
        { label: 'Government And Management', value: 'government_and_management' },
      ],
    },
    {
      name: 'state_id',
      type: 'relationship',
      relationTo: 'states',
      required: false, // nullable
      label: 'State',
    },
    {
      name: 'exam_id',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      label: 'Exam',
    },
    {
      name: 'website_url',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'registration_url',
      type: 'text',
      label: 'Registration URL',
    },
  ],
}

export default Counsellings
