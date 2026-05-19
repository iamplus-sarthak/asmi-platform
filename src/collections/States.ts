import { CollectionConfig } from 'payload'

const States: CollectionConfig = {
  slug: 'states',
  admin: {
    useAsTitle: 'name',
    description: 'Indian states',
    group: 'Academic',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'State Name',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'State Code',
      // e.g. IN, KA, TN
    },
  ],
}

export default States
