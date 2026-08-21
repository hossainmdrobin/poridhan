import mongoose, { Schema, Document, Model } from 'mongoose';
import { groqEmbed } from '../lib/agent/modelManager';



export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  quantity:number;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  sizes: { size: string; quantity: number }[];
  colors:{color:string,image:string,quantity:number}[]
  stock: number;
  images: string[];
  videoUrl?: string;
  tags: string[];
  seller: mongoose.Types.ObjectId;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  embedding:number[];
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
    quantity: {type:Number, default:0},
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    sizes: [
      {
        size: { type: String, enum: ['S', 'M', 'L', 'XL'] },
        quantity: { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        color: String,
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
    embedding:[{type:Number}]
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

ProductSchema.pre('save', async function () {
  if (this.isModified('name') || this.isModified('description') || this.isModified('tags') || !this.embedding?.length) {
    try {
      const textToEmbed = `${this.name}. ${this.description}. ${this.tags?.join(', ') || ''}`;
      this.embedding = await groqEmbed(textToEmbed) as number[];
    } catch (error) {
      console.error('Failed to generate embedding:', error);
    }
  }
});

async function generateEmbeddingForUpdate(
  update: Record<string, any>,
  current: IProduct | null
) {
  const hasName = 'name' in update || '$set' in update && 'name' in (update.$set || {});
  const hasDescription = 'description' in update || '$set' in update && 'description' in (update.$set || {});
  const hasTags = 'tags' in update || '$set' in update && 'tags' in (update.$set || {});

  if (!hasName && !hasDescription && !hasTags) return;

  const name = (update.name ?? update.$set?.name ?? current?.name) as string;
  const description = (update.description ?? update.$set?.description ?? current?.description) as string;
  const tags = (update.tags ?? update.$set?.tags ?? current?.tags) as string[] | undefined;

  try {
    const textToEmbed = `${name}. ${description}. ${tags?.join(', ') || ''}`;
    const embedding = await groqEmbed(textToEmbed) as number[];
    if (update.$set) {
      update.$set.embedding = embedding;
    } else {
      update.embedding = embedding;
    }
  } catch (error) {
    console.error('Failed to generate embedding on update:', error);
  }
}

ProductSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as Record<string, any>;
  const current = (await this.model.findOne(this.getQuery())) as IProduct | null;
  await generateEmbeddingForUpdate(update, current);
});

ProductSchema.pre('updateOne', async function () {
  const update = this.getUpdate() as Record<string, any>;
  const current = (await this.model.findOne(this.getQuery())) as IProduct | null;
  await generateEmbeddingForUpdate(update, current);
});

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
