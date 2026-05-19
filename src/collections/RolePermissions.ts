import { CollectionConfig } from 'payload'

const RolePermissions: CollectionConfig = {
  slug: 'role_permissions',
  admin: {
    useAsTitle: 'id',
    description: 'Junction table linking roles to permissions',
    group: 'Students & Access',
  },
  fields: [
    {
      name: 'role_id',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
      label: 'Role',
    },
    {
      name: 'permission_id',
      type: 'relationship',
      relationTo: 'permissions',
      required: true,
      label: 'Permission',
    },
  ],
}

export default RolePermissions
