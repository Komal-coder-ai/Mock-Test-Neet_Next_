import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './../../../../lib/mongoose'
import Paper from './../../../../models/Paper'
import User from './../../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      // Helper to save base64 image and return file path
      function saveBase64Image(base64: string, prefix: string = 'img'): string | null {
        if (!base64 || !base64.startsWith('data:image')) return null;
        const matches = base64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
        if (!matches) return null;
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const data = matches[2];
        const filename = `${prefix}_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
        return `/uploads/${filename}`;
      }
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

  if (req.method === 'GET') {
    // Return all questions for a paper, including image file paths
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ ok: false, error: 'Missing id' });
      await connectToDatabase();
      const paper = await Paper.findById(id);
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });
      // Ensure image field is always a file path for question and options
      const questions = (paper.questions || []).map((q: any) => ({
        _id: q._id,
        text: q.text,
        image: q.image || '',
        options: (q.options || []).map((opt: any) => ({
          text: opt.text,
          image: opt.image || ''
        })),
        correctIndex: q.correctIndex,
        subject: q.subject || ''
      }));
      return res.status(200).json({ ok: true, questions });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Server error' });
    }
  }
  if (req.method === 'POST') {
    const { adminPhone, questions, text, image, options, correctIndex, subject } = req.body || {};
    try {
      const paper = await Paper.findById(id);
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });

      paper.questions = paper.questions || [];

      // Bulk add if 'questions' array is present
      if (Array.isArray(questions)) {
        let added = 0;
        for (const q of questions) {
          if ((!q.text && !q.image) || !Array.isArray(q.options) || typeof q.correctIndex !== 'number') continue;
          // Save question image
          let questionImagePath = q.image ? saveBase64Image(q.image, 'question') : '';
          // Validate options and save images
          const options = Array.isArray(q.options)
            ? q.options.map((opt: any, idx: number) => ({
                text: opt.text || '',
                image: opt.image ? saveBase64Image(opt.image, `option${idx}`) : ''
              }))
            : [];
          if (options.some((opt: any) => !opt.text && !opt.image)) continue;
          const question = {
            text: q.text || '',
            image: questionImagePath,
            options,
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
      if ((!text && !image) || !Array.isArray(options) || typeof correctIndex !== 'number') return res.status(400).json({ ok: false, error: 'Missing question fields' });
      let questionImagePath = image ? saveBase64Image(image, 'question') : '';
      const opts = Array.isArray(options)
        ? options.map((opt: any, idx: number) => ({
            text: opt.text || '',
            image: opt.image ? saveBase64Image(opt.image, `option${idx}`) : ''
          }))
        : [];
      if (opts.some((opt: any) => !opt.text && !opt.image)) return res.status(400).json({ ok: false, error: 'Each option must have text or image' });
      const q: any = { text: text || '', image: questionImagePath, options: opts, correctIndex };
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
