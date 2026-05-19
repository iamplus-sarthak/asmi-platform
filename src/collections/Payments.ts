import { CollectionConfig } from 'payload'

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'order_id',
    description: 'Payment records via Razorpay',
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
      name: 'subscription_plan_id',
      type: 'relationship',
      relationTo: 'subscription_plans',
      label: 'Subscription Plan',
    },
    {
      name: 'gateway',
      type: 'text',
      label: 'Gateway',
      // e.g. razorpay
    },
    {
      name: 'order_id',
      type: 'text',
      label: 'Order ID',
      // e.g. razorpay_order_id
    },
    {
      name: 'payment_id',
      type: 'text',
      label: 'Payment ID',
      // e.g. razorpay_payment_id
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount',
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Currency',
      // e.g. INR
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
  ],
}

export default Payments
