import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
  email: string;
  password: string;
  followedShows: number[];
  oneTimeCode?: number;
}

interface UserDoc extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    followedShows: [{ type: Number }],
    oneTimeCode: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDoc>('User', UserSchema);

export default User;
