import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInfo extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const InfoSchema = new Schema<IInfo>(
  {
    text: { type: String, required: true },
    embedding: [{ type: Number }],
  },
  { timestamps: true }
);

export default (mongoose.models.Info as Model<IInfo>) || mongoose.model<IInfo>('Info', InfoSchema);
