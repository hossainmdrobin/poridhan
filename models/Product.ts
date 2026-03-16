import mongoose, { Schema, Document, Model } from 'mongoose';



export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  sizes: { size: string; quantity: number }[];
  colors:{image:string,quantity:number}[]
  stock: number;
  images: string[];
  videoUrl?: string;
  tags: string[];
  seller: mongoose.Types.ObjectId;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    sizes: [
      {
        size: { type: String, enum: ['S', 'M', 'L', 'XL'] },
        quantity: { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        image: { type: String, required: true },
        quantity: { type: Number, default: 0 },
      },
    ],
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    videoUrl: { type: String },
    tags: [{ type: String }],
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
