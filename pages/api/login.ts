import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const { phone } = req.body || {}

  if (!phone)
    return res.status(400).json({ error: 'Phone is required' })

  const phoneStr = String(phone).replace(/\D/g, '')
  if (phoneStr.length !== 10)
    return res.status(400).json({ error: 'Phone must be a 10-digit number' })

  try {
    await connectToDatabase()
    const user = await User.findOne({ phone: phoneStr })
    if (!user) {
      return res.status(200).json({ ok: false, error: 'Invalid user. Please register first.' })
    }

    // Directly generate tokens (skip OTP)
    const jwt = require('jsonwebtoken')
    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me'
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me'
    const payload = { id: user._id.toString(), phone: user.phone, role: user.role || 'user' }
    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '1d' })
    const refreshToken = jwt.sign({ id: user._id.toString() }, jwtRefreshSecret, { expiresIn: '7d' })

    return res.status(200).json({ ok: true, accessToken, refreshToken, id: user._id, role: user.role || 'user' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
