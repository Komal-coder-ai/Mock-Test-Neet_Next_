import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  fullName: string;
  class: string;
  dateOfBirth: string;
  aadharNumber: string;
  userId: string;
}

const ProfileSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  class: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
