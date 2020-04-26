import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema(
  {
    email: Type.string({ required: true, unique: true, trim: true }),
    password: Type.string({ required: true }),
    followedShows: Type.array().of({
      externalId: Type.string({ required: true }),
      name: Type.string({ required: true }),
    }),
  },
  { timestamps: true }
);

const User = typedModel('User', UserSchema);

export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;

export default User;
