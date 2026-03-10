import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletter extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  isSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true },
    isSubscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Newsletter as Model<INewsletter>) || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
