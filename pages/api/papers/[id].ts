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

      if (subject && subject.toLowerCase() !== 'all') {
        const subjLower = subject.toLowerCase()
        const filtered = {
          ...paper,
          questions: (paper.questions || []).filter((q: any) => {
            const qsub = String(q.subject || '').toLowerCase()
            return qsub === subjLower || (includeUnspecified && !qsub)
          })
        }
        return res.status(200).json({ ok: true, paper: filtered, subjectCounts: counts })
      }

      return res.status(200).json({ ok: true, paper, subjectCounts: counts })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
