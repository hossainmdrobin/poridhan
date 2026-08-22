import { Product } from '@/models';
import { connectToDB } from './../db';
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { groqEmbed } from './modelManager';


/**
 * Search products by name, category, color, etc.
 */
export const searchProducts = tool(
  async ({ query, limit }) => {
    await connectToDB();

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        // { colors: { $regex: query, $options: "i" } },
      ],
    })
      .limit(limit)
      .select("name price description images colors stock");

    return JSON.stringify(
      products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        colors: product.colors,
        stock: product.stock,
      }))
    );
  },
  {
    name: "searchProducts",
    description:
      "Search the store's products by name, description, category, color, or other keywords. Use this when a customer asks about available products.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "Product search query, such as 'blue cotton three piece' or 'three piece under 700 taka'"
        ),

      limit: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5)
        .describe("Maximum number of products to return"),
    }),
  }
);

/**
 * Get a single product by ID.
 */
export const getProduct = tool(
  async ({ productId }) => {
    await connectToDB();

    const product = await Product.findById(productId).select(
      "name price description images colors stock category"
    );

    if (!product) {
      return JSON.stringify({
        success: false,
        message: "Product not found",
      });
    }

    return JSON.stringify({
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        colors: product.colors,
        stock: product.stock,
        category: product.category,
      },
    });
  },
  {
    name: "getProduct",
    description:
      "Get detailed information about a specific product using its product ID.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB ObjectId of the product"),
    }),
  }
);

/**
 * Check product stock.
 */
export const checkStock = tool(
  async ({ productId, color }) => {
    await connectToDB();

    const product = await Product.findById(productId).select(
      "name colors stock"
    );

    if (!product) {
      return JSON.stringify({
        success: false,
        message: "Product not found",
      });
    }

    // If your stock is a simple number
    if (!color) {
      return JSON.stringify({
        success: true,
        productId: product._id.toString(),
        productName: product.name,
        stock: product.stock,
        available: product.stock > 0,
      });
    }

    // If colors have separate stock
    // Adjust this part according to your actual schema.
    const colorData = product.colors?.find(
      (item: any) =>
        typeof item === "string"
          ? item.toLowerCase() === color.toLowerCase()
          : item.name?.toLowerCase() === color.toLowerCase()
    );

    if (!colorData) {
      return JSON.stringify({
        success: false,
        message: `Color '${color}' is not available for this product.`,
      });
    }

    return JSON.stringify({
      success: true,
      productId: product._id.toString(),
      productName: product.name,
      color,
      available: true,
    });
  },
  {
    name: "checkStock",
    description:
      "Check whether a product is currently available in stock. Use this before telling a customer that a product or color is available.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB ObjectId of the product"),

      color: z
        .string()
        .optional()
        .describe("Specific color the customer wants"),
    }),
  }
);

/**
 * Search products by semantic vector similarity.
 */
export const productVectorSearch = tool(
  async ({ query, limit, threshold }) => {
    await connectToDB();

    let queryEmbedding: number[];
    try {
      const embedding = await groqEmbed(query);
      const normalizedEmbedding = Array.isArray(embedding)
        ? embedding.filter((value): value is number => typeof value === "number")
        : [];

      if (!normalizedEmbedding.length || normalizedEmbedding.length !== embedding?.length) {
        return JSON.stringify({
          success: false,
          message: "Failed to generate embedding for the query.",
        });
      }

      queryEmbedding = normalizedEmbedding;
    } catch {
      return JSON.stringify({
        success: false,
        message: "Failed to generate embedding for the query.",
      });
    }

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: "autoembed_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
        },
      },
      {
        $match: { isActive: true },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          images: 1,
          colors: 1,
          stock: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $match: { score: { $gte: threshold } },
      },
    ]);

    return JSON.stringify({
      success: true,
      products: products.map((product: any) => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        colors: product.colors,
        stock: product.stock,
        score: product.score,
      })),
    });
  },
  {
    name: "productVectorSearch",
    description:
      "Search the store's products by semantic similarity using vector embeddings. Use this when a customer describes what they are looking for in natural language and the keyword search might not find relevant results.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "Natural language product search query, such as 'comfortable cotton kurta for summer' or 'formal shoes for office'"
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5)
        .describe("Maximum number of products to return"),
      threshold: z
        .number()
        .min(0)
        .max(1)
        .default(0.5)
        .describe(
          "Minimum cosine similarity score (0 to 1) to consider a result relevant"
        ),
    }),
  }
);