import { CollectionConfig } from 'payload'

const InstituteCourses: CollectionConfig = {
  slug: 'institute_courses',
  admin: {
    useAsTitle: 'label',
    description: 'Courses offered by an institute with total seats',
    group: 'Institutes',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Label',
      admin: {
        description: 'e.g. AIIMS Delhi - MBBS',
      },
    },
    {
      name: 'institute_id',
      type: 'relationship',
      relationTo: 'institutes',
      required: true,
      label: 'Institute',
    },
    {
      name: 'course_id',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
    },
    {
      name: 'total_seats',
      type: 'number',
      required: true,
      label: 'Total Seats',
    },
  ],
}

export default InstituteCourses
