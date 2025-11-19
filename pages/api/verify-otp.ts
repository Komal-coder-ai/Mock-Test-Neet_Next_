import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'
import jwt from 'jsonwebtoken'

function getSecret(name: string, fallback: string) {
  return process.env[name] || fallback
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { phone, otp } = req.body || {}
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and otp are required' })

  try {
    await connectToDatabase()
    const user = await User.findOne({ phone })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!user.otp || !user.otpExpires) return res.status(400).json({ error: 'No OTP requested' })
    if (new Date() > new Date(user.otpExpires)) return res.status(400).json({ error: 'OTP expired' })
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })

    user.verified = true
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()

    // generate tokens
    const jwtSecret = getSecret('JWT_SECRET', 'dev_secret_change_me')
    const jwtRefreshSecret = getSecret('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me')

    const payload = { id: user._id.toString(), phone: user.phone, role: user.role || 'user' }
    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user._id.toString() }, jwtRefreshSecret, { expiresIn: '7d' })

    return res.status(200).json({ ok: true, accessToken, refreshToken, id: user._id, role: user.role || 'user' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
