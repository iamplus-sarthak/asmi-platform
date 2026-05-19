import { CollectionConfig } from 'payload'

const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'full_name',
    description: 'Student profiles',
    group: 'Students & Access',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone_number',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'date_of_birth',
      type: 'date',
      label: 'Date of Birth',
    },
    {
      name: 'profile_photo_url',
      type: 'text',
      label: 'Profile Photo URL',
    },
    {
      name: 'state_id',
      type: 'relationship',
      relationTo: 'states',
      label: 'State',
    },
    {
      name: 'prefferd_exam_id',
      type: 'relationship',
      relationTo: 'exams',
      label: 'Preferred Exam',
    },
    {
      name: 'current_class',
      type: 'select',
      label: 'Current Class',
      options: [
        { label: '11th Standard', value: '11' },
        { label: '12th Standard', value: '12' },
        { label: 'Dropper', value: 'dropper' },
      ],
    },
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      label: 'Linked User Account',
    },
  ],
}

export default Students
