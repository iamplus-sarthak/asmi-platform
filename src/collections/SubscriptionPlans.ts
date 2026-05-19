import { CollectionConfig } from 'payload'

const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription_plans',
  admin: {
    useAsTitle: 'name',
    description: 'Subscription plans like Free, Premium, Pro',
    group: 'Subscriptions',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Plan Name',
      // e.g. Free, Premium, Pro
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price',
    },
    {
      name: 'duration_days',
      type: 'number',
      required: true,
      label: 'Duration (Days)',
      // e.g. 30, 90, 365
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Is Active',
      defaultValue: true,
    },
  ],
}

export default SubscriptionPlans
