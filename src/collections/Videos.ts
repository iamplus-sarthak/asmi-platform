import { CollectionConfig } from 'payload'

const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    description: 'Educational and informational videos',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video URL (YouTube/Vimeo)',
    },
    {
      name: 'thumbnail_url',
      type: 'text',
      label: 'Thumbnail URL',
    },
    {
      name: 'is_published',
      type: 'checkbox',
      label: 'Is Published',
      defaultValue: true,
    },
  ],
}

export default Videos
