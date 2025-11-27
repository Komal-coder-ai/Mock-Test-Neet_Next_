import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../lib/mongoose'

import Paper from './../../../models/Paper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' })

   await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const paper = await Paper.findById(id).lean()
      if (!paper) return res.status(404).json({ ok: false, error: 'Not found' })

      // optional subject filtering: ?subject=Physics
      const subject = typeof req.query.subject === 'string' ? req.query.subject.trim() : undefined
      const includeUnspecified = String(req.query.includeUnspecified || 'false').toLowerCase() === 'true'

      // compute subject counts for client convenience
      const counts: Record<string, number> = {}
      ;(paper.questions || []).forEach((q: any) => {
        const s = (q.subject || 'Unspecified')
        const key = String(s)
        counts[key] = (counts[key] || 0) + 1
      })

      // Normalize questions for API consumer: expose only needed fields and ensure subject exists
      // include _id so admin UIs can reference specific questions
      const normalizedAllQuestions = (paper.questions || []).map((q: any) => ({
        _id: q._id,
        text: q.text,
        image: q.image || '',
        options: (q.options || []).map((opt: any) => ({
          text: opt.text,
          image: opt.image || ''
        })),
        correctIndex: q.correctIndex,
        subject: q.subject || ''
      }))

      if (subject && subject.toLowerCase() !== 'all') {
        const subjLower = subject.toLowerCase()
        const filteredQuestions = (paper.questions || []).filter((q: any) => {
          const qsub = String(q.subject || '').toLowerCase()
          return qsub === subjLower || (includeUnspecified && !qsub)
        }).map((q: any) => ({
          _id: q._id,
          text: q.text,
          image: q.image || '',
          options: (q.options || []).map((opt: any) => ({
            text: opt.text,
            image: opt.image || ''
          })),
          correctIndex: q.correctIndex,
          subject: q.subject || ''
        }))

        const filtered = {
          ...paper,
          questions: filteredQuestions
        }
        return res.status(200).json({ ok: true, paper: filtered, subjectCounts: counts })
      }

      const fullPaper = {
        ...paper,
        questions: normalizedAllQuestions
      }

      return res.status(200).json({ ok: true, paper: fullPaper, subjectCounts: counts })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  if (req.method === 'PUT') {
    // update paper metadata
    const { adminPhone, title, durationMinutes, totalQuestions, date, icon, source, official, exam, name } = req.body || {}
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' })
    try {
      const User = (await import('../../../models/User')).default
      const admin = await User.findOne({ phone: adminPhone })
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' })

      const paperDoc = await (await import('../../../models/Paper')).default.findById(id)
      if (!paperDoc) return res.status(404).json({ ok: false, error: 'Paper not found' })

      if (title !== undefined) paperDoc.title = title
      if (durationMinutes !== undefined) paperDoc.durationMinutes = durationMinutes
      if (totalQuestions !== undefined) paperDoc.totalQuestions = totalQuestions
      if (date !== undefined) paperDoc.date = date ? new Date(date) : undefined
      if (icon !== undefined) paperDoc.icon = icon
      if (source !== undefined) paperDoc.source = source
      if (official !== undefined) paperDoc.official = !!official
      if (exam !== undefined) paperDoc.exam = exam
      if (name !== undefined) paperDoc.name = name

      await paperDoc.save()
      return res.status(200).json({ ok: true, paper: paperDoc })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
