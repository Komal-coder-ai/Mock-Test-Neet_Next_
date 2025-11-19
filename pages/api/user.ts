import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()
    const phone = (req.method === 'GET') ? (req.query.phone as string | undefined) : (req.body?.phone as string | undefined)
    if (!phone) return res.status(400).json({ error: 'phone is required' })
    const user = await User.findOne({ phone }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    // do not return sensitive fields like otp
    const { otp, otpExpires, ...safeUser } = user as any
    return res.status(200).json({ ok: true, user: safeUser })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
