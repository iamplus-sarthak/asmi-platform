import { CollectionConfig } from 'payload'

const InstituteCourseFees: CollectionConfig = {
  slug: 'institute_course_fees',
  admin: {
    useAsTitle: 'id',
    description: 'Fee details for a course in an institute per counselling and quota',
    group: 'Institutes',
  },
  fields: [
    {
      name: 'institute_course_id',
      type: 'relationship',
      relationTo: 'institute_courses',
      required: true,
      label: 'Institute Course',
    },
    {
      name: 'counselling_id',
      type: 'relationship',
      relationTo: 'counsellings',
      required: true,
      label: 'Counselling',
    },
    {
      name: 'quota_id',
      type: 'relationship',
      relationTo: 'counselling_quotas',
      required: true,
      label: 'Quota',
    },
    {
      name: 'academic_year_id',
      type: 'relationship',
      relationTo: 'academic_years',
      required: true,
      label: 'Academic Year',
    },
    {
      name: 'annual_fee',
      type: 'number',
      label: 'Annual Fee',
    },
    {
      name: 'fee_remarks',
      type: 'textarea',
      label: 'Fee Remarks',
    },
    {
      name: 'stipend_year_1',
      type: 'number',
      label: 'Stipend Year 1',
    },
    {
      name: 'stipend_year_2',
      type: 'number',
      label: 'Stipend Year 2',
    },
    {
      name: 'stipend_year_3',
      type: 'number',
      label: 'Stipend Year 3',
    },
    {
      name: 'stipend_remarks',
      type: 'textarea',
      label: 'Stipend Remarks',
    },
    {
      name: 'bond_years',
      type: 'number',
      label: 'Bond Years',
    },
    {
      name: 'bond_penalty_amount',
      type: 'number',
      label: 'Bond Penalty Amount',
    },
    {
      name: 'bond_remarks',
      type: 'textarea',
      label: 'Bond Remarks',
    },
  ],
}

export default InstituteCourseFees
