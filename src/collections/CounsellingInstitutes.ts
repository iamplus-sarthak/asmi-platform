import { CollectionConfig } from 'payload'

const CounsellingInstitutes: CollectionConfig = {
  slug: 'counselling_institutes',
  admin: {
    useAsTitle: 'id',
    description: 'Junction table linking counsellings to institutes',
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
      name: 'institute_id',
      type: 'relationship',
      relationTo: 'institutes',
      required: true,
      label: 'Institute',
    },
  ],
}

export default CounsellingInstitutes
