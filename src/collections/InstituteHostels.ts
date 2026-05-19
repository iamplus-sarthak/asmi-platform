import { CollectionConfig } from 'payload'

const InstituteHostels: CollectionConfig = {
  slug: 'institute_hostels',
  admin: {
    useAsTitle: 'id',
    description: 'Hostel details for an institute',
    group: 'Institutes',
  },
  fields: [
    {
      name: 'institute_id',
      type: 'relationship',
      relationTo: 'institutes',
      required: true,
      label: 'Institute',
    },
    {
      name: 'is_men_hostel_available',
      type: 'checkbox',
      label: 'Men Hostel Available',
    },
    {
      name: 'is_women_hostel_available',
      type: 'checkbox',
      label: 'Women Hostel Available',
    },
    {
      name: 'hostel_fee_details',
      type: 'textarea',
      label: 'Hostel Fee Details',
    },
    {
      name: 'hostel_fee_link',
      type: 'text',
      label: 'Hostel Fee Link',
    },
  ],
}

export default InstituteHostels
