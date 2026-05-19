import { CollectionConfig } from 'payload'

const Universities: CollectionConfig = {
  slug: 'universities',
  admin: {
    useAsTitle: 'name',
    description: 'Universities linked to states',
    group: 'Academic',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'University Name',
    },
    {
      name: 'university_type',
      type: 'select',
      required: true,
      label: 'University Type',
      options: [
        { label: 'Central', value: 'central' },
        { label: 'Deemed', value: 'deemed' },
        { label: 'State Government', value: 'state_govt' },
        { label: 'State Private', value: 'state_private' },
      ],
    },
    {
      name: 'state_id',
      type: 'relationship',
      relationTo: 'states',
      required: true,
      label: 'State',
    },
  ],
}

export default Universities
