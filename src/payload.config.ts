import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import Exams from './collections/Exams'
import Courses from './collections/Courses'
import ExamCourses from './collections/ExamCourses'
import States from './collections/States'
import Universities from './collections/Universities'
import Counsellings from './collections/Counsellings'
import AcademicYears from './collections/AcademicYears'
import CounsellingCycles from './collections/CounsellingCycles'
import CounsellingQuotas from './collections/CounsellingQuotas'
import CounsellingTimelines from './collections/CounsellingTimelines'
import CounsellingAnnouncements from './collections/CounsellingAnnouncements'
import Announcements from './collections/Announcements'
import InstituteTypes from './collections/InstituteTypes'
import Institutes from './collections/Institutes'
import CounsellingInstitutes from './collections/CounsellingInstitutes'
import InstituteImages from './collections/InstituteImages'
import InstituteAddress from './collections/InstituteAddress'
import InstituteHospitals from './collections/InstituteHospitals'
import InstituteContactPersons from './collections/InstituteContactPersons'
import InstituteHostels from './collections/InstituteHostels'
import InstituteCourses from './collections/InstituteCourses'
import InstituteCourseFees from './collections/InstituteCourseFees'
import AdmissionStatus from './collections/AdmissionStatus'
import Allotments from './collections/Allotments'
import Roles from './collections/Roles'
import Students from './collections/Students'
import Permissions from './collections/Permissions'
import RolePermissions from './collections/RolePermissions'
import UserOtps from './collections/UserOtps'
import SubscriptionPlans from './collections/SubscriptionPlans'
import UserSubscriptions from './collections/UserSubscriptions'
import Payments from './collections/Payments'
import SubscriptionPermissions from './collections/SubscriptionPermissions'
import Users from './collections/Users'
import Videos from './collections/Videos'
import Resources from './collections/Resources'
import PromoCodes from './collections/PromoCodes'
import SupportTickets from './collections/SupportTickets'
import Sessions from './collections/Sessions'
import AdminActivityLogs from './collections/AdminActivityLogs'
import AdminTasks from './collections/AdminTasks'
import PlatformAnalytics from './globals/PlatformAnalytics'

import { activityLogHook, activityLogDeleteHook } from './collections/hooks/activityLogHook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const rawCollections = [
    Users,
    {
      slug: 'media',
      upload: true,
      admin: {
        group: 'Admin',
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    Exams,
    Courses,
    ExamCourses,
    States,
    Universities,
    Counsellings,
    AcademicYears,
    CounsellingCycles,
    CounsellingQuotas,
    CounsellingTimelines,
    CounsellingAnnouncements,
    Announcements,
    InstituteTypes,
    Institutes,
    CounsellingInstitutes,
    InstituteImages,
    InstituteAddress,
    InstituteHospitals,
    InstituteContactPersons,
    InstituteHostels,
    InstituteCourses,
    InstituteCourseFees,
    AdmissionStatus,
    Allotments,
    Roles,
    Students,
    Permissions,
    RolePermissions,
    UserOtps,
    SubscriptionPlans,
    UserSubscriptions,
    Payments,
    SubscriptionPermissions,
    Videos,
    Resources,
    PromoCodes,
    SupportTickets,
    Sessions,
    AdminActivityLogs,
    AdminTasks,
  ] as any[];

const collectionsWithHooks = rawCollections.map((col) => {
  // Skip attaching hook to the activity logs collection itself and sessions
  if (col.slug === 'admin_activity_logs' || col.slug === 'sessions') return col;

  return {
    ...col,
    hooks: {
      ...col.hooks,
      afterChange: [...(col.hooks?.afterChange || []), activityLogHook],
      afterDelete: [...(col.hooks?.afterDelete || []), activityLogDeleteHook]
    }
  };
});

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: collectionsWithHooks,

  editor: lexicalEditor(),
  globals: [PlatformAnalytics],

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),

  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  cors: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  csrf: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],

  sharp,

  onInit: async (payload) => {
    try {
      // Seed Roles
      const roles = ['admin', 'student'];
      const roleIds: Record<string, string | number> = {};

      for (const roleName of roles) {
        const existingRole = await payload.find({
          collection: 'roles',
          where: { name: { equals: roleName } },
        });

        if (existingRole.totalDocs === 0) {
          const newRole = await payload.create({
            collection: 'roles',
            data: { name: roleName },
          });
          roleIds[roleName] = newRole.id;
        } else {
          roleIds[roleName] = existingRole.docs[0].id;
        }
      }

      // Seed Admin User
      const adminPhone = '9898989898';
      const existingAdmin = await payload.find({
        collection: 'users',
        where: { phone_number: { equals: adminPhone } },
      });

      if (existingAdmin.totalDocs === 0 && roleIds['admin']) {
        await payload.create({
          collection: 'users',
          data: {
            phone_number: adminPhone,
            email: 'admin@asmi.platform',
            password: 'admin-password',
            roleid: roleIds['admin'],
            onboarding_completed: true,
            is_active: true,
          } as any,
        });
        payload.logger.info('Admin user seeded successfully with phone 0000000000.');
      }
    } catch (error) {
      payload.logger.error({ err: error }, 'Error seeding database');
    }
  },
})
