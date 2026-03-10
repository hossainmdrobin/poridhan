import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWhatsAppLead extends Document {
  _id: mongoose.Types.ObjectId;
  phone?: string;
  discountCode?: string;
  source: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const WhatsAppLeadSchema = new Schema<IWhatsAppLead>(
  {
    phone: String,
    discountCode: String,
    source: { type: String, default: 'qr' },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default (mongoose.models.WhatsAppLead as Model<IWhatsAppLead>) || mongoose.model<IWhatsAppLead>('WhatsAppLead', WhatsAppLeadSchema);
