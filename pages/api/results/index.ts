import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongoose'
import Result from '../../../models/Result'
import { authenticateApi } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const user = authenticateApi(req, res);
  if (!user) return;
  if (req.method === 'GET') {
    const { userPhone } = req.query
    if (!userPhone || typeof userPhone !== 'string') return res.status(400).json({ ok: false, error: 'userPhone required' })
    try {
      const rows = await Result.find({ userPhone: String(userPhone) }).sort({ createdAt: -1 }).lean()
      return res.status(200).json({ ok: true, results: rows })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  if (req.method === 'POST') {
    // optional create endpoint (not used by current flow)
    const body = req.body || {}
    try {
      const doc = await Result.create(body)
      return res.status(201).json({ ok: true, id: String(doc._id) })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
