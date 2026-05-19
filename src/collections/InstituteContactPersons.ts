import { CollectionConfig } from 'payload'

const InstituteContactPersons: CollectionConfig = {
  slug: 'institute_contact_persons',
  admin: {
    useAsTitle: 'name',
    description: 'Contact persons for an institute like dean, nodal officer',
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'designation',
      type: 'select',
      label: 'Designation',
      options: [
        { label: 'Dean', value: 'dean' },
        { label: 'Nodal Officer', value: 'nodal_officer' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'contact_no_1',
      type: 'text',
      label: 'Contact No 1',
    },
    {
      name: 'contact_no_2',
      type: 'text',
      label: 'Contact No 2',
    },
  ],
}

export default InstituteContactPersons
