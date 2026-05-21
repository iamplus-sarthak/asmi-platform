import { CollectionConfig } from 'payload'

const PromoCodes: CollectionConfig = {
  slug: 'promo_codes',
  admin: {
    useAsTitle: 'code',
    description: 'Promo codes and discounts for subscriptions',
    group: 'Subscriptions',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Promo Code',
    },
    {
      name: 'discount_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ],
      defaultValue: 'percentage',
      label: 'Discount Type',
    },
    {
      name: 'discount_value',
      type: 'number',
      required: true,
      label: 'Discount Value',
    },
    {
      name: 'usage_limit',
      type: 'number',
      label: 'Usage Limit',
    },
    {
      name: 'used_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
      label: 'Times Used',
    },
    {
      name: 'expiry_date',
      type: 'date',
      label: 'Expiry Date',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Active',
    },
  ],
}

export default PromoCodes
