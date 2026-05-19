import { CollectionConfig } from 'payload'

const CounsellingCycles: CollectionConfig = {
  slug: 'counselling_cycles',
  admin: {
    useAsTitle: 'id',
    description: 'Counselling cycles per academic year',
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
      name: 'academic_year_id',
      type: 'relationship',
      relationTo: 'academic_years',
      required: true,
      label: 'Academic Year',
    },
    {
      name: 'total_rounds',
      type: 'number',
      required: true,
      label: 'Total Rounds',
    },
  ],
}

export default CounsellingCycles
