import mongoose, { Schema, Document } from 'mongoose'

export interface IPaper extends Document {
  title: string
  category: 'JEE' | 'NEET'
  durationMinutes: number
  totalQuestions: number
  date?: Date
  questions?: Array<{
    text: string
    options: string[]
    correctIndex: number
  }>
  // admin metadata
  icon?: string
  source?: string
  official?: boolean
  exam?: string
  name?: string
  questionsCount?: number
  createdAt: Date
}

const PaperSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['JEE', 'NEET'], required: true },
    durationMinutes: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    date: { type: Date },
    questions: [
      {
        text: { type: String, required: true },
        options: { type: [String], required: true },
        correctIndex: { type: Number, required: true }
      }
    ],
    icon: { type: String },
    source: { type: String },
    official: { type: Boolean, default: false },
    exam: { type: String },
    name: { type: String },
    questionsCount: { type: Number }
  },
  { timestamps: true }
)

export default (mongoose.models.Paper as mongoose.Model<IPaper>) || mongoose.model<IPaper>('Paper', PaperSchema)
