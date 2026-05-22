import { CollectionConfig } from 'payload'

const ClosingRanks: CollectionConfig = {
  slug: 'closing_ranks',
  admin: {
    useAsTitle: 'id',
    description: 'Closing ranks per institute, course, quota, and category',
    group: 'Academic',
  },
  fields: [
    {
      name: 'academic_year_id',
      type: 'relationship',
      relationTo: 'academic_years',
      required: true,
      label: 'Academic Year',
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
      required: true,
      label: 'Category',
      // e.g. Open, OBC, SC, ST
    },
    {
      name: 'round_no',
      type: 'number',
      required: true,
      label: 'Round Number',
    },
    {
      name: 'closing_rank',
      type: 'number',
      required: true,
      label: 'Closing Rank',
    },
    {
      name: 'closing_score',
      type: 'number',
      label: 'Closing Score (Optional)',
    },
  ],
}

export default ClosingRanks
