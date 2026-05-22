import { CollectionConfig } from 'payload'

const SeatMatrix: CollectionConfig = {
  slug: 'seat_matrix',
  admin: {
    useAsTitle: 'id',
    description: 'Seat matrix availability per institute, course, quota, and category',
    group: 'Academic',
  },
  fields: [
    {
      name: 'academic_year_id',
      type: 'relationship',
      relationTo: 'academic_years',
      required: true,
      label: 'Academic Year',
    },
    {
      name: 'counselling_id',
      type: 'relationship',
      relationTo: 'counsellings',
      required: true,
      label: 'Counselling',
    },
    {
      name: 'institute_id',
      type: 'relationship',
      relationTo: 'institutes',
      required: true,
      label: 'Institute',
    },
    {
      name: 'institute_course_id',
      type: 'relationship',
      relationTo: 'institute_courses',
      required: true,
      label: 'Institute Course',
    },
    {
      name: 'quota_id',
      type: 'relationship',
      relationTo: 'counselling_quotas',
      required: true,
      label: 'Quota',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Category',
      // e.g. Open, OBC, SC, ST
    },
    {
      name: 'round_no',
      type: 'number',
      required: true,
      label: 'Round Number',
    },
    {
      name: 'total_seats',
      type: 'number',
      required: true,
      label: 'Total Seats Available',
    },
    {
      name: 'seats_remarks',
      type: 'text',
      label: 'Seats Remarks',
      // e.g. 0+3(VV)
    },
  ],
}

export default SeatMatrix
