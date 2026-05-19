import { CollectionConfig } from 'payload'

const AdmissionStatus: CollectionConfig = {
  slug: 'admission_status',
  admin: {
    useAsTitle: 'name',
    description: 'Admission status like Admitted, Not Admitted, Info NA',
    group: 'Academic',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Status Name',
      // e.g. Admitted, Not Admitted, Info NA
    },
  ],
}

export default AdmissionStatus
