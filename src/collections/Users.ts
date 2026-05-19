import { CollectionConfig } from 'payload'
import jwt from 'jsonwebtoken'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true, // we use custom OTP, but actually Payload might complain if we disable it and still use auth. We can keep it and just not use it.
  },
  admin: {
    useAsTitle: 'phone_number',
    group: 'Students & Access',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'phone_number',
      type: 'text',
      label: 'Phone Number',
      unique: true,
      required: true,
    },
    {
      name: 'roleid',
      type: 'relationship',
      relationTo: 'roles',
      label: 'Role',
    },
    {
      name: 'entity_id',
      type: 'relationship',
      relationTo: ['students'],
      label: 'Entity Profile',
    },
    {
      name: 'onboarding_completed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Onboarding Completed',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Is Active',
      defaultValue: true,
    },
    {
      name: 'last_login_at',
      type: 'date',
      label: 'Last Login At',
    },
  ],
  endpoints: [
    {
      path: '/send-otp',
      method: 'post',
      handler: async (req) => {
        const { mobile } = await req.json!()
        if (!mobile) return Response.json({ error: 'Mobile required' }, { status: 400 })

        // Check if user exists
        let users = await req.payload.find({
          collection: 'users',
          where: { phone_number: { equals: mobile } },
          limit: 1,
        })

        let user = users.docs[0]
        if (!user) {
          // Create dummy user, Payload auth requires email, we can mock it
          user = await req.payload.create({
            collection: 'users',
            data: {
              phone_number: mobile,
              email: `${mobile}@placeholder.asmi`, // Payload requires email for auth true
              password: Math.random().toString(36).slice(-8), // random password, they never use it
              onboarding_completed: false,
            } as any,
          })
        }

        const otp = '1234' // Hardcoded for now
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 5)

        await req.payload.create({
          collection: 'user_otps',
          data: {
            user_id: user.id,
            otp_code: otp,
            purpose: 'login',
            expires_at: expiresAt.toISOString(),
            is_used: false,
          },
        })

        return Response.json({ success: true })
      },
    },
    {
      path: '/verify-otp',
      method: 'post',
      handler: async (req) => {
        const { mobile, otp } = await req.json!()
        if (!mobile || !otp) return Response.json({ error: 'Mobile and OTP required' }, { status: 400 })

        // Find user
        const users = await req.payload.find({
          collection: 'users',
          where: { phone_number: { equals: mobile } },
          limit: 1,
        })
        const user = users.docs[0]
        if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

        // Find OTP
        const otps = await req.payload.find({
          collection: 'user_otps',
          where: {
            user_id: { equals: user.id },
            otp_code: { equals: otp },
            is_used: { equals: false },
            expires_at: { greater_than: new Date().toISOString() },
          },
          sort: '-createdAt',
          limit: 1,
        })

        const validOtp = otps.docs[0]
        if (!validOtp) return Response.json({ error: 'Invalid or expired OTP' }, { status: 400 })

        // Mark OTP used
        await req.payload.update({
          collection: 'user_otps',
          id: validOtp.id,
          data: { is_used: true },
        })

        // Generate JWT based on Payload config (if custom, we have to mock what payload does)
        // Or we can use req.payload.login but it requires email/password.
        // Easiest is to generate token using payload secret
        const collectionConfig = req.payload.collections['users'].config
        const fieldsToSign = {
          email: user.email,
          id: user.id,
          collection: 'users',
        }
        
        const token = jwt.sign(fieldsToSign, req.payload.secret, {
          expiresIn: collectionConfig.auth.tokenExpiration || 7200,
        })

        // Construct the cookie string
        const maxAge = collectionConfig.auth.tokenExpiration || 7200;
        const cookieStr = `payload-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=None; Secure`;

        return new Response(JSON.stringify({
          message: 'Auth Passed',
          user,
          token,
          isNewUser: !user.onboarding_completed,
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieStr,
          }
        })
      },
    },
  ],
}

export default Users
