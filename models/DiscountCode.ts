import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscountCode extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountCodeSchema = new Schema<IDiscountCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minPurchase: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default (mongoose.models.DiscountCode as Model<IDiscountCode>) || mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);
