import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from './../../../../lib/mongoose'
import Paper from './../../../../models/Paper'
import User from './../../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' });
      try {
        await connectToDatabase();
        const paper = await Paper.findById(id);
        if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });
        paper.questions = [];
        await paper.save();
        return res.status(200).json({ ok: true, message: 'All questions deleted.' });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: 'Server error' });
      }
    }
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' })

  await connectToDatabase()

  if (req.method === 'POST') {
    const { adminPhone, questions, text, options, correctIndex, subject } = req.body || {};
    try {
      const paper = await Paper.findById(id);
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });

      paper.questions = paper.questions || [];

      // Bulk add if 'questions' array is present
      if (Array.isArray(questions)) {
        let added = 0;
        for (const q of questions) {
          if (!q.text || !Array.isArray(q.options) || typeof q.correctIndex !== 'number') continue;
          const question = {
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            subject: q.subject ? String(q.subject) : undefined,
          };
          paper.questions.push(question);
          added++;
        }
        await paper.save();
        return res.status(201).json({ ok: true, added });
      }

      // Single question fallback
      if (!text || !Array.isArray(options) || typeof correctIndex !== 'number') return res.status(400).json({ ok: false, error: 'Missing question fields' });
      const q: any = { text, options, correctIndex };
      if (subject) q.subject = String(subject);
      paper.questions.push(q);
      await paper.save();
      return res.status(201).json({ ok: true, question: q });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}
