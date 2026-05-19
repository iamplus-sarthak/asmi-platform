import { CollectionConfig } from 'payload'

const SubscriptionPermissions: CollectionConfig = {
  slug: 'subscription_permissions',
  admin: {
    useAsTitle: 'id',
    description: 'Junction table linking subscription plans to permissions',
    group: 'Subscriptions',
  },
  fields: [
    {
      name: 'plan_id',
      type: 'relationship',
      relationTo: 'subscription_plans',
      required: true,
      label: 'Subscription Plan',
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

export default SubscriptionPermissions
