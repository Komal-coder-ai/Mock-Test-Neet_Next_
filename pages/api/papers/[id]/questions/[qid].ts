import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../../../lib/mongoose'
import Paper from './../../../../../models/Paper'
import User from './../../../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, qid } = req.query
  if (!id || typeof id !== 'string' || !qid || typeof qid !== 'string') return res.status(400).json({ ok: false, error: 'Missing id or qid' })

  await connectToDatabase()

  if (req.method === 'PUT') {
    const { text, options, correctIndex, subject, adminPhone } = req.body || {}
    if (!text || !Array.isArray(options) || typeof correctIndex !== 'number') return res.status(400).json({ ok: false, error: 'Missing fields' })
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' })

    try {
      const admin = await User.findOne({ phone: adminPhone })
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' })

      const paper = await Paper.findById(id)
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' })

      const q: any = (paper.questions || []).id(qid)
      if (!q) return res.status(404).json({ ok: false, error: 'Question not found' })

      q.text = text
      q.options = options
      q.correctIndex = correctIndex
      q.subject = subject || ''

      await paper.save()

      return res.status(200).json({ ok: true, question: { _id: q._id, text: q.text, options: q.options, correctIndex: q.correctIndex, subject: q.subject } })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  if (req.method === 'DELETE') {
    const { adminPhone } = req.body || {}
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' })
    try {
      const admin = await User.findOne({ phone: adminPhone })
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' })

      const paper = await Paper.findById(id)
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' })

      const q = (paper.questions || []).id(qid)
      if (!q) return res.status(404).json({ ok: false, error: 'Question not found' })

      q.remove()
      await paper.save()

      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
