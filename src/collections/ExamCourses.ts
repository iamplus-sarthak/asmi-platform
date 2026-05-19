import { CollectionConfig } from 'payload'

const ExamCourses: CollectionConfig = {
  slug: 'exam_courses',
  admin: {
    useAsTitle: 'id',
    description: 'Junction table linking exams to courses (many-to-many)',
    group: 'Exams & Courses',
  },
  fields: [
    {
      name: 'exam_id',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      label: 'Exam',
    },
    {
      name: 'course_id',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
    },
  ],
}

export default ExamCourses
