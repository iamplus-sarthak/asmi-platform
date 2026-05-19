import { CollectionConfig } from 'payload'

const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'name',
    description: 'Medical courses like MBBS, BDS, MD Medicine, etc.',
    group: 'Exams & Courses',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Course Name',
      // e.g. MBBS, BDS, MD Medicine
    },
    {
      name: 'course_type',
      type: 'select',
      required: true,
      label: 'Course Type',
      options: [
        { label: 'Clinical', value: 'clinical' },
        { label: 'Para-Clinical', value: 'para_clinical' },
        { label: 'Non-Clinical', value: 'non_clinical' },
        { label: 'Pre-Clinical', value: 'pre_clinical' },
      ],
    },
    {
      name: 'degree_type',
      type: 'select',
      required: true,
      label: 'Degree Type',
      options: [
        { label: 'Medical', value: 'medical' },
        { label: 'Dental', value: 'dental' },
        { label: 'Diploma', value: 'diploma' },
        { label: 'BSc', value: 'bsc' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration',
      // e.g. 5.5 years, 4 years
    },
  ],
}

export default Courses
