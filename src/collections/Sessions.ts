import { CollectionConfig } from 'payload'

const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'session_id',
    description: 'User engagement session logs',
    group: 'Analytics',
  },
  access: {
    read: () => true, // or restrict to admin
    create: () => true, // we will use local payload API anyways
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'session_id',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'duration_seconds',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'page_views',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'is_bounced',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'last_active_at',
      type: 'date',
    },
  ],
}

export default Sessions
