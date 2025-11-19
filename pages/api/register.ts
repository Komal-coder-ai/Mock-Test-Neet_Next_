import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongoose'
import User from '../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, phone } = req.body || {}
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' })

  try {
    await connectToDatabase()
    const user = await User.create({ name, phone })
    return res.status(201).json({ ok: true, id: user._id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
