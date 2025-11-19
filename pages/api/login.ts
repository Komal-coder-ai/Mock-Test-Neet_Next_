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

    // 🚫 If phone number not in DB → Login not allowed
    if (!user) {
      return res.status(404).json({ error: 'Invalid user. Please register first.' })
    }

    // Generate OTP for login
    const otp = generateOtp()
    user.otp = otp
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000)
    await user.save()

    return res.status(200).json({ ok: true, otp })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
