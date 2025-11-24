import mongoose, { Schema, Document } from 'mongoose';

export interface IRank extends Document {
  paperId: string;
  userPhone: string;
  rank: number;
  totalParticipants: number;
}

const RankSchema: Schema = new Schema({
  paperId: { type: String, required: true, index: true },
  userPhone: { type: String, required: true, index: true },
  rank: { type: Number, required: true },
  totalParticipants: { type: Number, required: true }
});

export default mongoose.models.Rank || mongoose.model<IRank>('Rank', RankSchema);
