import mongoose, { Schema, Document, Model } from 'mongoose';
import { groqEmbed } from '../lib/agent/modelManager';

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

InfoSchema.index({ text: 'text' });

InfoSchema.pre('save', async function () {
  if (this.isModified('text') || !this.embedding?.length) {
    try {
      this.embedding = await groqEmbed(this.text) as number[];
    } catch (error) {
      console.error('Failed to generate embedding:', error);
    }
  }
});

export default (mongoose.models.Info as Model<IInfo>) || mongoose.model<IInfo>('Info', InfoSchema);
