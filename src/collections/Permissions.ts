import { CollectionConfig } from 'payload'

const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'name',
    description: 'Permissions like manage_colleges, view_allotments',
    group: 'Students & Access',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Permission Name',
      // e.g. manage_colleges, view_allotments
    },
  ],
}

export default Permissions
