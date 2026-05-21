import * as z from 'zod';

export const universitySchema = z.object({
    name: z.string().min(1, 'University name is required'),
    university_type: z.enum(['central', 'deemed', 'state_govt', 'state_private'], {
        message: 'University type is required',
    }),
    state_id: z.union([z.string().min(1, 'State is required'), z.number()]),
});

export type UniversityFormValues = z.infer<typeof universitySchema>;

export const instituteAddressSchema = z.object({
    id: z.number().optional(),
    address_line_1: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state_id: z.union([z.string(), z.number()]).optional(),
    pincode: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    google_maps_url: z.string().url().optional().or(z.literal('')),
});

export const instituteContactPersonSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required'),
    designation: z.enum(['dean', 'nodal_officer']).optional(),
    email: z.string().email().optional().or(z.literal('')),
    contact_no_1: z.string().optional(),
    contact_no_2: z.string().optional(),
});

export const instituteImageSchema = z.object({
    id: z.number().optional(),
    image_type: z.enum(['campus', 'hostel', 'hospital'], { message: 'Image type is required' }),
    image_url: z.string().optional(),
    file: z.any().optional(), // File object for new uploads
});

export const instituteSchema = z.object({
    name: z.string().min(1, 'Institute name is required'),
    short_name: z.string().optional(),
    institute_code: z.string().optional(),
    institute_type_id: z.union([z.string().min(1, 'Institute type is required'), z.number()]),
    authority_type: z.enum(['central', 'state']).optional(),
    state_id: z.union([z.string(), z.number()]).optional(),
    university_id: z.union([z.string(), z.number()]).optional(),
    established_year: z.coerce.number().optional(),
    description: z.string().optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    logo_url: z.string().optional(),
    cover_url: z.string().optional(),
    
    // Nested relations
    address: instituteAddressSchema.optional(),
    contact_persons: z.array(instituteContactPersonSchema).optional(),
    images: z.array(instituteImageSchema).optional(),
});

export type InstituteFormValues = z.infer<typeof instituteSchema>;


export const courseMasterSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    course_type: z.enum(['clinical', 'para_clinical', 'non_clinical', 'pre_clinical'], {
        message: 'Course type is required',
    }),
    degree_type: z.enum(['medical', 'dental', 'diploma', 'bsc'], {
        message: 'Degree type is required',
    }),
    duration: z.string().optional(),
});
export type CourseMasterFormValues = z.infer<typeof courseMasterSchema>;

export const counsellingSchema = z.object({
    name: z.string().min(1, 'Counselling name is required'),
    counselling_type: z.enum(['government', 'management', 'government_and_management'], {
        message: 'Counselling type is required',
    }),
    state_id: z.union([z.string(), z.number()]).optional().or(z.literal('')),
    exam_id: z.union([z.string().min(1, 'Exam is required'), z.number()]),
    website_url: z.string().url().optional().or(z.literal('')),
    registration_url: z.string().url().optional().or(z.literal('')),
});
export type CounsellingFormValues = z.infer<typeof counsellingSchema>;

export const counsellingQuotaSchema = z.object({
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    name: z.string().min(1, 'Quota name is required'),
    description: z.string().optional(),
});
export type CounsellingQuotaFormValues = z.infer<typeof counsellingQuotaSchema>;

export const counsellingAnnouncementSchema = z.object({
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    topic: z.string().min(1, 'Topic is required'),
    description: z.string().optional(),
    announcement_date: z.string().optional(),
    link: z.string().url().optional().or(z.literal('')),
    link_tag: z.string().optional(),
});
export type CounsellingAnnouncementFormValues = z.infer<typeof counsellingAnnouncementSchema>;

export const announcementSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    announcement_type: z.enum(['quick', 'event', 'general']),
    target_audience: z.enum(['all', 'neet', 'jee']),
    status: z.enum(['published', 'draft', 'scheduled']),
    scheduled_date: z.string().optional(),
});
export type AnnouncementFormValues = z.infer<typeof announcementSchema>;


export const counsellingTimelineSchema = z.object({
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    title: z.string().min(1, 'Title is required'),
    event_date: z.string().min(1, 'Event date is required'),
});
export type CounsellingTimelineFormValues = z.infer<typeof counsellingTimelineSchema>;

export const counsellingCycleSchema = z.object({
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    academic_year_id: z.union([z.string().min(1, 'Academic year is required'), z.number()]),
    total_rounds: z.coerce.number().min(1, 'Must be at least 1'),
});
export type CounsellingCycleFormValues = z.infer<typeof counsellingCycleSchema>;

export const counsellingInstituteSchema = z.object({
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    institute_id: z.union([z.string().min(1, 'Institute is required'), z.number()]),
});
export type CounsellingInstituteFormValues = z.infer<typeof counsellingInstituteSchema>;

export const academicYearSchema = z.object({
    year: z.string().min(1, 'Academic Year is required (e.g. 2024-25)'),
});
export type AcademicYearFormValues = z.infer<typeof academicYearSchema>;

export const examSchema = z.object({
    name: z.string().min(1, 'Exam name is required'),
    short_name: z.string().min(1, 'Short name is required'),
    description: z.string().optional(),
});
export type ExamFormValues = z.infer<typeof examSchema>;

export const examCourseSchema = z.object({
    exam_id: z.union([z.string().min(1, 'Exam is required'), z.number()]),
    course_id: z.union([z.string().min(1, 'Course is required'), z.number()]),
});
export type ExamCourseFormValues = z.infer<typeof examCourseSchema>;

export const instituteTypeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});
export type InstituteTypeFormValues = z.infer<typeof instituteTypeSchema>;

export const instituteCourseSchema = z.object({
    institute_id: z.union([z.string().min(1, 'Institute is required'), z.number()]),
    course_id: z.union([z.string().min(1, 'Course is required'), z.number()]),
    label: z.string().min(1, 'Label is required'),
    total_seats: z.coerce.number().min(1, 'Required'),
});
export type InstituteCourseFormValues = z.infer<typeof instituteCourseSchema>;

export const instituteCourseFeeSchema = z.object({
    institute_course_id: z.union([z.string().min(1, 'Institute Course is required'), z.number()]),
    counselling_id: z.union([z.string().min(1, 'Counselling is required'), z.number()]),
    quota_id: z.union([z.string().min(1, 'Quota is required'), z.number()]),
    academic_year_id: z.union([z.string().min(1, 'Academic Year is required'), z.number()]),
    annual_fee: z.coerce.number().optional(),
    fee_remarks: z.string().optional(),
    stipend_year_1: z.coerce.number().optional(),
    stipend_year_2: z.coerce.number().optional(),
    stipend_year_3: z.coerce.number().optional(),
    stipend_remarks: z.string().optional(),
    bond_years: z.coerce.number().optional(),
    bond_penalty_amount: z.coerce.number().optional(),
    bond_remarks: z.string().optional(),
});
export type InstituteCourseFeeFormValues = z.infer<typeof instituteCourseFeeSchema>;

export const instituteHospitalSchema = z.object({
    institute_id: z.union([z.string().min(1, 'Institute is required'), z.number()]),
    hospital_name: z.string().min(1, 'Hospital Name is required'),
    bed_count: z.coerce.number().optional(),
    description: z.string().optional(),
});
export type InstituteHospitalFormValues = z.infer<typeof instituteHospitalSchema>;

export const instituteHostelSchema = z.object({
    institute_id: z.union([z.string().min(1, 'Institute is required'), z.number()]),
    is_men_hostel_available: z.boolean().optional(),
    is_women_hostel_available: z.boolean().optional(),
    hostel_fee_details: z.string().optional(),
    hostel_fee_link: z.string().url().optional().or(z.literal('')),
});
export type InstituteHostelFormValues = z.infer<typeof instituteHostelSchema>;

export const videoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    url: z.string().url('Must be a valid URL'),
    thumbnail_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    is_published: z.boolean().optional(),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    resource_type: z.enum(['pdf', 'image', 'link', 'other'], {
        message: 'Resource type is required',
    }),
    external_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    is_published: z.boolean().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
