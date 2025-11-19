import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../lib/mongoose'
import Paper from './../../../models/Paper'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'POST') {
    const { title, category, durationMinutes, totalQuestions, date } = req.body || {}
    if (!title || !category || !durationMinutes || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const paper = await Paper.create({ title, category, durationMinutes, totalQuestions, date: date ? new Date(date) : undefined })
      return res.status(201).json({ ok: true, paper })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  if (req.method === 'GET') {
    const category = (req.query.category as string) || 'JEE'
    const page = parseInt((req.query.page as string) || '1', 10)
    const limit = parseInt((req.query.limit as string) || '5', 10)

    try {
      const filter = { category }
      const total = await Paper.countDocuments(filter)
      const papers = await Paper.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      return res.status(200).json({ ok: true, papers, total })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
