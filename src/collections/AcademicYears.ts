import { CollectionConfig } from 'payload'

const AcademicYears: CollectionConfig = {
  slug: 'academic_years',
  admin: {
    useAsTitle: 'year',
    description: 'Academic years e.g. 2024-25, 2025-26',
    group: 'Exams & Courses',
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      label: 'Academic Year',
      // e.g. 2024-25, 2025-26
    },
  ],
}

export default AcademicYears
