import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  phone: string
  createdAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { timestamps: true }
)

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('Mock_TestUser', UserSchema)
