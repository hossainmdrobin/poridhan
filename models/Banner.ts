import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Banner as Model<IBanner>) || mongoose.model<IBanner>('Banner', BannerSchema);
