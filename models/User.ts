import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  phone: string
  aadhar?: string
  otp?: string
  otpExpires?: Date
  verified?: boolean
  createdAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    aadhar: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('Mock_TestUser', UserSchema)
