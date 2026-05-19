import { CollectionConfig } from 'payload'

const InstituteAddress: CollectionConfig = {
  slug: 'institute_address',
  admin: {
    useAsTitle: 'city',
    description: 'Address details of an institute',
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
      name: 'address_line_1',
      type: 'text',
      label: 'Address Line 1',
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
    },
    {
      name: 'district',
      type: 'text',
      label: 'District',
    },
    {
      name: 'state_id',
      type: 'relationship',
      relationTo: 'states',
      label: 'State',
    },
    {
      name: 'pincode',
      type: 'text',
      label: 'Pincode',
    },
    {
      name: 'latitude',
      type: 'number',
      label: 'Latitude',
    },
    {
      name: 'longitude',
      type: 'number',
      label: 'Longitude',
    },
    {
      name: 'google_maps_url',
      type: 'text',
      label: 'Google Maps URL',
    },
  ],
}

export default InstituteAddress
