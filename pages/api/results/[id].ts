import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongoose'
import Result from '../../../models/Result'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' })

  if (req.method === 'GET') {
    try {
      const doc = await Result.findById(id).lean()
      if (!doc) return res.status(404).json({ ok: false, error: 'Not found' })
      return res.status(200).json({ ok: true, result: doc })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
