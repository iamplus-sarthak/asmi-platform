import { CollectionConfig } from 'payload'

const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    description: 'Downloadable resources and study materials',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Resource Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'resource_type',
      type: 'select',
      required: true,
      label: 'Resource Type',
      options: [
        { label: 'PDF Document', value: 'pdf' },
        { label: 'Image', value: 'image' },
        { label: 'External Link', value: 'link' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'pdf',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File Attachment',
      admin: {
        condition: (data) => data.resource_type !== 'link',
      },
    },
    {
      name: 'external_url',
      type: 'text',
      label: 'External URL',
      admin: {
        condition: (data) => data.resource_type === 'link',
      },
    },
    {
      name: 'is_published',
      type: 'checkbox',
      label: 'Is Published',
      defaultValue: true,
    },
  ],
}

export default Resources
