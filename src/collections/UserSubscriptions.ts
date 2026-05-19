import { CollectionConfig } from 'payload'

const UserSubscriptions: CollectionConfig = {
  slug: 'user_subscriptions',
  admin: {
    useAsTitle: 'id',
    description: 'User subscription records',
    group: 'Subscriptions',
  },
  fields: [
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
    },
    {
      name: 'plan_id',
      type: 'relationship',
      relationTo: 'subscription_plans',
      required: true,
      label: 'Plan',
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'payment_id',
      type: 'relationship',
      relationTo: 'payments',
      label: 'Payment',
    },
  ],
}

export default UserSubscriptions
