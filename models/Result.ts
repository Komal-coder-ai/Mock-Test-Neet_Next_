import mongoose, { Schema, model, models } from 'mongoose'

const ResultSchema = new Schema({
  userPhone: { type: String, required: true, index: true },
  paperId: { type: String, required: true, index: true },
  paperTitle: { type: String },
  total: { type: Number, default: 0 },
  answeredCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  percent: { type: Number, default: 0 },
  perQuestion: { type: Array, default: [] },
  subjectBreakdown: { type: Object, default: {} },
  answers: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
})

// Ensure we don't recompile model in dev
const Result = (models.Result as mongoose.Model<any>) || model('Result', ResultSchema)
export default Result
