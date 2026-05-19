import { CollectionConfig } from 'payload'

const Allotments: CollectionConfig = {
  slug: 'allotments',
  admin: {
    useAsTitle: 'year',
    description: 'Seat allotments per counselling round',
    group: 'Academic',
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      label: 'Year',
      // e.g. 2024-25
    },
    {
      name: 'round_no',
      type: 'number',
      required: true,
      label: 'Round No',
    },
    {
      name: 'counselling_id',
      type: 'relationship',
      relationTo: 'counsellings',
      required: true,
      label: 'Counselling',
    },
    {
      name: 'institute_id',
      type: 'relationship',
      relationTo: 'institutes',
      required: true,
      label: 'Institute',
    },
    {
      name: 'institute_course_id',
      type: 'relationship',
      relationTo: 'institute_courses',
      required: true,
      label: 'Institute Course',
    },
    {
      name: 'quota_id',
      type: 'relationship',
      relationTo: 'counselling_quotas',
      required: true,
      label: 'Quota',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      // e.g. UR, OBC, SC, ST
    },
    {
      name: 'ai_rank',
      type: 'number',
      label: 'AI Rank',
    },
    {
      name: 'state_rank',
      type: 'number',
      label: 'State Rank',
    },
    {
      name: 'admission_status_id',
      type: 'relationship',
      relationTo: 'admission_status',
      label: 'Admission Status',
    },
  ],
}

export default Allotments
