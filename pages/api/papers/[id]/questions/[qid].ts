import fs from 'fs';
import path from 'path';

import Paper from '../../../../../models/Paper';
import { connectToDatabase } from '../../../../../lib/mongoose';
import User from '../../../../../models/User';

export default async function handler(req, res) {
  const { id, qid } = req.query;
  if (!id || typeof id !== 'string' || !qid || typeof qid !== 'string') return res.status(400).json({ ok: false, error: 'Missing id or qid' });

  await connectToDatabase();

  if (req.method === 'PUT') {
    const body = req.body || {};
    const text = body.text;
    const image = body.image;
    const options = body.options;
    const correctIndex = body.correctIndex;
    const subject = body.subject;
    const adminPhone = body.adminPhone;
    if ((!text && !image) || !Array.isArray(options) || typeof correctIndex !== 'number') return res.status(400).json({ ok: false, error: 'Missing fields' });
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' });

    try {
      const admin = await User.findOne({ phone: adminPhone });
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' });

      const paper = await Paper.findById(id);
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });

      const question = (paper.questions || []).find((q) => String(q._id) === String(qid));
      if (!question) return res.status(404).json({ ok: false, error: 'Question not found' });

      if (image && typeof image === 'string' && image.startsWith('data:image')) {
        // Save new image to disk
        const ext = image.substring(image.indexOf('/') + 1, image.indexOf(';'));
        const base64Data = image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        const fileName = `question_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        fs.writeFileSync(filePath, base64Data, 'base64');
        question.image = `/uploads/${fileName}`;
      } else if (typeof image === 'string' && image.length > 0 && image.startsWith('/uploads/')) {
        // If image is already a file path, just set it
        question.image = image;
      } else {
        question.image = '';
      }
      question.text = text;
      question.options = options;
      question.correctIndex = correctIndex;
      question.subject = subject || '';

      await paper.save();

      return res.status(200).json({ ok: true, question: { _id: question._id, text: question.text, options: question.options, correctIndex: question.correctIndex, subject: question.subject, image: question.image } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    const body = req.body || {};
    const adminPhone = body.adminPhone;
    if (!adminPhone) return res.status(403).json({ ok: false, error: 'adminPhone required' });
    try {
      const admin = await User.findOne({ phone: adminPhone });
      if (!admin || admin.role !== 'admin') return res.status(403).json({ ok: false, error: 'Not authorized' });

      const paper = await Paper.findById(id);
      if (!paper) return res.status(404).json({ ok: false, error: 'Paper not found' });

      const question = (paper.questions || []).find((q) => String(q._id) === String(qid));
      if (!question) return res.status(404).json({ ok: false, error: 'Question not found' });

      if (typeof question.remove === 'function') question.remove();
      await paper.save();

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Server error' });
    }
  } else {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  }

