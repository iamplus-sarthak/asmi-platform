import { CollectionConfig } from 'payload'

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    description: 'User roles like student, admin, counselor',
    group: 'Students & Access',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Role Name',
      // e.g. student, admin, counselor
    },
  ],
}

export default Roles
