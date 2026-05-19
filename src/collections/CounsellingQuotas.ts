import { CollectionConfig } from 'payload'

const CounsellingQuotas: CollectionConfig = {
  slug: 'counselling_quotas',
  admin: {
    useAsTitle: 'name',
    description: 'Quotas under a counselling like AIQ, State Quota, Management',
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Quota Name',
      // e.g. AIQ, State Quota, Management
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}

export default CounsellingQuotas
