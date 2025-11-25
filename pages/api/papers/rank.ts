import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongoose';
import Rank from '../../../models/Rank';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { userPhone, paperId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!userPhone || !paperId) {
      return res.status(400).json({ error: 'userPhone and paperId are required' });
    }
    // Find all results for this paper
    const results = await (await import('../../../models/Result')).default.find({ paperId });
    // Only keep the best/latest attempt per userPhone
    const userBest: Record<string, any> = {};
    for (const r of results) {
      const score = r.correctCount * 4 - r.wrongCount;
      if (!userBest[r.userPhone] || score > userBest[r.userPhone].score || (score === userBest[r.userPhone].score && new Date(r.createdAt).getTime() < new Date(userBest[r.userPhone].createdAt).getTime())) {
        userBest[r.userPhone] = {
          userPhone: r.userPhone,
          paperId: r.paperId,
          score,
          createdAt: r.createdAt,
        };
      }
    }
    // Convert to array and sort
    const scored = Object.values(userBest);
    scored.sort((a: any, b: any) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    // Assign ranks
    const ranks = scored.map((r: any, idx: number) => ({
      userPhone: r.userPhone,
      paperId: r.paperId,
      rank: idx + 1,
      totalParticipants: scored.length
    }));
    // Filter for requested user
    const userRanks = ranks.filter(r => r.userPhone === userPhone && r.paperId === paperId);
    res.status(200).json({ ranks: userRanks });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}
