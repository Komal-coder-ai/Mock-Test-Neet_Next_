import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongoose';
import Rank from '../../../models/Rank';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { userPhone } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!userPhone) {
      return res.status(400).json({ error: 'userPhone is required' });
    }
    // Find all ranks for this user
    const ranks = await Rank.find({ userPhone });
    res.status(200).json({ ranks });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}
