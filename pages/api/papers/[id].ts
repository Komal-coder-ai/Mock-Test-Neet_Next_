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
      return res.status(200).json({ ok: true, paper })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ ok: false, error: 'Server error' })
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
