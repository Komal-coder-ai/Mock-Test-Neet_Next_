import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongoose';
import Result from '../../../../models/Result';
import Rank from '../../../../models/Rank';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectToDatabase();
	const { id } = req.query;

	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Get all results for the paper
		const results = await Result.find({ paperId: id });
		if (!results.length) {
			return res.status(404).json({ error: 'No results found for this paper' });
		}

		// Calculate total scores for each user
		const userScores: Record<string, number> = {};
		results.forEach(result => {
			userScores[result.userPhone] = (userScores[result.userPhone] || 0) + (result.correctCount || 0);
		});
		// Sort users by score descending
		const sorted = Object.entries(userScores)
			.map(([userPhone, score]) => ({ userPhone, score }))
			.sort((a, b) => b.score - a.score);

		// Save ranks in Rank model
		const totalParticipants = sorted.length;
		for (let i = 0; i < sorted.length; i++) {
			const userPhone = sorted[i].userPhone;
			const rank = i + 1;
			await Rank.findOneAndUpdate(
				{ paperId: id, userPhone },
				{ paperId: id, userPhone, rank, totalParticipants },
				{ upsert: true }
			);
		}

		// If userPhone is provided in query, return only that user's rank
		const { userPhone } = req.query;
		if (userPhone) {
			const userRank = await Rank.findOne({ paperId: id, userPhone });
			if (!userRank) {
				return res.status(404).json({ error: 'No rank found for this user' });
			}
			return res.status(200).json({
				userPhone: userRank.userPhone,
				rank: userRank.rank,
				totalParticipants: userRank.totalParticipants
			});
		}
		// Otherwise, return all ranks for the paper
		const allRanks = await Rank.find({ paperId: id });
		res.status(200).json({ ranks: allRanks });
	} catch (error) {
		res.status(500).json({ error: 'Server error', details: error.message });
	}
}
