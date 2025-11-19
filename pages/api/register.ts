import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'
import crypto from 'crypto'

function generateOtp() {
  // simple 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, phone, aadhar, type } = req.body || {}
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' })

  try {
    await connectToDatabase()

    let user = await User.findOne({ phone })
    if (!user) {
      const role = type === 'admin' ? 'admin' : 'user'
      user = await User.create({ name, phone, aadhar, role })
    } else {
      // update aadhar/name if provided
      if (aadhar) user.aadhar = aadhar
      if (name) user.name = name
      // allow upgrading to admin if type explicitly provided
      if (type === 'admin') user.role = 'admin'
    }

    // generate OTP and save (no real SMS; return OTP in response for now)
    const otp = generateOtp()
    user.otp = otp
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    await user.save()

    return res.status(201).json({ ok: true, id: user._id, otp: otp })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
