import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings {
  showWelcomeStrip: boolean;
}

interface IUser {
  email: string;
  password: string;
  followedShows: number[];
  oneTimeCode?: number;
  settings: IUserSettings;
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
    settings: {
      showWelcomeStrip: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDoc>('User', UserSchema);

export default User;
