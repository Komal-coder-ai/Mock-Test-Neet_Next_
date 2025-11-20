import { NextApiRequest, NextApiResponse } from 'next';

import Profile from '../../models/Profile';
import { connectToDatabase } from '../../lib/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      await connectToDatabase()

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.status(404).json({ ok: false, error: 'Profile not found' });
      res.status(200).json({ ok: true, profile });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const { fullName, class: userClass, dateOfBirth, aadharNumber, userId } = req.body;
    if (!fullName || !userClass || !dateOfBirth || !aadharNumber || !userId) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { fullName, class: userClass, dateOfBirth, aadharNumber },
        { upsert: true, new: true }
      );
      res.status(200).json({ ok: true, profile });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    const { userId, ...update } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    try {
      const profile = await Profile.findOneAndUpdate({ userId }, update, { new: true });
      if (!profile) return res.status(404).json({ ok: false, error: 'Profile not found' });
      res.status(200).json({ ok: true, profile });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Server error' });
    }
  }
}
