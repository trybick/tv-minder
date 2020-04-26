import { createSchema, ExtractDoc, ExtractProps, Type, typedModel } from 'ts-mongoose';

const ShowSchema = createSchema(
  {
    name: Type.string({ required: true }),
    externalId: Type.string({ required: true, immutable: true }),
  },
  { timestamps: true }
);

const Show = typedModel('Show', ShowSchema);

export type ShowDoc = ExtractDoc<typeof ShowSchema>;
export type ShowProps = ExtractProps<typeof ShowSchema>;

export default Show;
