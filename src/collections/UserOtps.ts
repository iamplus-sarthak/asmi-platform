import { CollectionConfig } from 'payload'

const UserOtps: CollectionConfig = {
  slug: 'user_otps',
  admin: {
    useAsTitle: 'otp_code',
    description: 'OTPs for login, signup, reset_password',
    group: 'Students & Access',
  },
  fields: [
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
    },
    {
      name: 'otp_code',
      type: 'text',
      required: true,
      label: 'OTP Code',
    },
    {
      name: 'purpose',
      type: 'select',
      required: true,
      label: 'Purpose',
      options: [
        { label: 'Login', value: 'login' },
        { label: 'Signup', value: 'signup' },
        { label: 'Reset Password', value: 'reset_password' },
      ],
    },
    {
      name: 'expires_at',
      type: 'date',
      required: true,
      label: 'Expires At',
    },
    {
      name: 'is_used',
      type: 'checkbox',
      label: 'Is Used',
      defaultValue: false,
    },
  ],
}

export default UserOtps
