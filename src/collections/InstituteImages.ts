import { CollectionConfig } from 'payload'

const InstituteImages: CollectionConfig = {
  slug: 'institute_images',
  admin: {
    useAsTitle: 'image_type',
    description: 'Images of an institute like campus, hostel, hospital',
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
      name: 'image_url',
      type: 'text',
      required: true,
      label: 'Image URL',
    },
    {
      name: 'image_type',
      type: 'select',
      required: true,
      label: 'Image Type',
      options: [
        { label: 'Campus', value: 'campus' },
        { label: 'Hostel', value: 'hostel' },
        { label: 'Hospital', value: 'hospital' },
      ],
    },
  ],
}

export default InstituteImages
