import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { phone, aadhar } = req.body || {}
  if (!phone) return res.status(400).json({ error: 'Phone is required' })

  try {
    await connectToDatabase()
    let user = await User.findOne({ phone })
    if (!user) {
      // create a minimal user if not exists (as requested: "that data base for now any thing")
      user = await User.create({ name: 'Anonymous', phone, aadhar })
    }

    // generate OTP
    const otp = generateOtp()
    user.otp = otp
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000)
    await user.save()

    // In production send OTP by SMS; for now return otp in response for testing
    return res.status(200).json({ ok: true, otp })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
