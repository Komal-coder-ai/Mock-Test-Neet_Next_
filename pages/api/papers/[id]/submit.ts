import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/mongoose'
import Paper from '../../../../models/Paper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing paper id' })

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  const { answers } = req.body || {}
  if (!answers || typeof answers !== 'object') return res.status(400).json({ ok: false, error: 'Missing answers' })

  try {
    await connectToDatabase()
    const paper = await Paper.findById(id).lean()
    if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' })

    const questions = (paper.questions || []) as any[]
    const total = questions.length

    let answeredCount = 0
    let correctCount = 0
    let wrongCount = 0

    const perQuestion: Array<any> = []
    const subjectMap: Record<string, { total: number; attempted: number; correct: number }> = {}

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const qid = q && q._id ? String(q._id) : String(i)
      const selected = answers[qid]
      const isAnswered = selected !== undefined && selected !== null
      const correct = typeof q.correctIndex === 'number' ? q.correctIndex : null
      const isCorrect = isAnswered && correct !== null && Number(selected) === Number(correct)

      if (isAnswered) answeredCount++
      if (isCorrect) correctCount++
      if (isAnswered && !isCorrect) wrongCount++

      const subj = (q.subject || 'Unspecified')
      if (!subjectMap[subj]) subjectMap[subj] = { total: 0, attempted: 0, correct: 0 }
      subjectMap[subj].total += 1
      if (isAnswered) subjectMap[subj].attempted += 1
      if (isCorrect) subjectMap[subj].correct += 1

      perQuestion.push({ qid, index: i, selected: isAnswered ? Number(selected) : null, correct, isCorrect, subject: subj })
    }

    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0

    const result = { total, answeredCount, correctCount, wrongCount, percent, perQuestion, subjectBreakdown: subjectMap }

    return res.status(200).json({ ok: true, result })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
