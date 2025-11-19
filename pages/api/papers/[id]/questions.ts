import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../../lib/mongoose'
import Paper from './../../../../models/Paper'
import User from './../../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' })

  await connectToDatabase()

  if (req.method === 'POST') {
    const { text, options, correctIndex, adminPhone, subject } = req.body || {}
    if (!text || !Array.isArray(options) || typeof correctIndex !== 'number') return res.status(400).json({ ok: false, error: 'Missing question fields' })
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' })

    try {
      const admin = await User.findOne({ phone: adminPhone })
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' })

      const paper = await Paper.findById(id)
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' })

      paper.questions = paper.questions || []
      const q: any = { text, options, correctIndex }
      if (subject) q.subject = String(subject)
      paper.questions.push(q)
      await paper.save()

      return res.status(201).json({ ok: true, question: q })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
