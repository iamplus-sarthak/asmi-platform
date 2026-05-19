import { CollectionConfig } from 'payload'

const Institutes: CollectionConfig = {
  slug: 'institutes',
  admin: {
    useAsTitle: 'name',
    description: 'Medical institutes/colleges',
    group: 'Institutes',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Institute Name',
    },
    {
      name: 'short_name',
      type: 'text',
      label: 'Short Name',
    },
    {
      name: 'institute_code',
      type: 'text',
      label: 'Institute Code',
    },
    {
      name: 'institute_type_id',
      type: 'relationship',
      relationTo: 'institute_types',
      required: true,
      label: 'Institute Type',
    },
    {
      name: 'authority_type',
      type: 'select',
      label: 'Authority Type',
      options: [
        { label: 'Central', value: 'central' },
        { label: 'State', value: 'state' },
      ],
    },
    {
      name: 'state_id',
      type: 'relationship',
      relationTo: 'states',
      label: 'State',
    },
    {
      name: 'university_id',
      type: 'relationship',
      relationTo: 'universities',
      label: 'University',
    },
    {
      name: 'established_year',
      type: 'number',
      label: 'Established Year',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'website_url',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'logo_url',
      type: 'text',
      label: 'Logo URL',
    },
    {
      name: 'cover_url',
      type: 'text',
      label: 'Cover URL',
    },
  ],
}

export default Institutes
