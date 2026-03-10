import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: String,
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (mongoose.models.Testimonial as Model<ITestimonial>) || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
