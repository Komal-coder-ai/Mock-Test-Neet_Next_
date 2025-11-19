import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../lib/mongoose'
import Paper from './../../../models/Paper'
import User from './../../../models/User'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'POST') {
    const {
      exam,
      name,
      questionsCount,
      durationMinutes,
      date,
      icon,
      source,
      official,
      adminPhone
    } = req.body || {}

    // map incoming JSON to internal fields
    const category = exam === 'NEET' ? 'NEET' : 'JEE'
    const title = name
    const totalQuestions = questionsCount

    if (!title || !category || !durationMinutes || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // simple admin check: require adminPhone and verify role
    if (!adminPhone) return res.status(403).json({ error: 'adminPhone required to create paper' })
    try {
      const admin = await User.findOne({ phone: adminPhone })
      if (!admin || (admin.role !== 'admin')) return res.status(403).json({ error: 'Not authorized' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error' })
    }

    try {
      const paper = await Paper.create({
        title,
        category,
        durationMinutes,
        totalQuestions,
        date: date ? new Date(date) : undefined,
        questions: [],
        icon: icon || undefined,
        source: source || undefined,
        official: !!official,
        exam: exam || undefined,
        name: name || undefined,
        questionsCount: questionsCount || undefined
      })
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
