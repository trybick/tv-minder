import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

const AlbumSchema = createSchema(
  {
    name: Type.string({ required: true }),
    artist: Type.string({ required: true }),
    notes: Type.string({ required: false, default: null }),
  },
  { timestamps: true }
);

const Album = typedModel('Album', AlbumSchema);

export type AlbumDoc = ExtractDoc<typeof AlbumSchema>;
export type AlbumProps = ExtractProps<typeof AlbumSchema>;

export default Album;
