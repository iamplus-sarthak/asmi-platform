import { CollectionConfig } from 'payload'

const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'name',
    description: 'Entrance exams like NEET UG, NEET PG, NEET MDS, etc.',
    group: 'Exams & Courses',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Exam Name',
      // e.g. NEET UG, NEET PG, NEET MDS
    },
    {
      name: 'short_name',
      type: 'text',
      required: true,
      label: 'Short Name',
      // e.g. NEETUG, NEETPG
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}

export default Exams
