import { CollectionConfig } from 'payload'

const InstituteTypes: CollectionConfig = {
  slug: 'institute_types',
  admin: {
    useAsTitle: 'name',
    description: 'Types of institutes like government, deemed, private, nbe',
    group: 'Institutes',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Type Name',
      // e.g. government, deemed, private, nbe
    },
  ],
}

export default InstituteTypes
