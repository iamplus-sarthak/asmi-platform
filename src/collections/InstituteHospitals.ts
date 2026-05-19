import { CollectionConfig } from 'payload'

const InstituteHospitals: CollectionConfig = {
  slug: 'institute_hospitals',
  admin: {
    useAsTitle: 'hospital_name',
    description: 'Hospital details linked to an institute',
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
      name: 'hospital_name',
      type: 'text',
      required: true,
      label: 'Hospital Name',
    },
    {
      name: 'bed_count',
      type: 'number',
      label: 'Bed Count',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}

export default InstituteHospitals
