import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { phone, aadhar } = req.body || {}
  if (!phone || !aadhar) return res.status(400).json({ error: 'Phone and aadhar are required' })

  try {
    await connectToDatabase()
    const user = await User.findOne({ phone })
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.aadhar = aadhar
    await user.save()
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
