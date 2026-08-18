import { connectToDB } from './../db';
import { Info } from '@/models';
import { groqEmbed } from './modelManager';
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const searchInfo = tool(
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

    const docs = await Info.aggregate([
      {
        $vectorSearch: {
          index: "info_embedding_vector",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          text: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      // {
      //   $match: {
      //     score: { $gte: threshold },
      //   },
      // },
    ]);

    return JSON.stringify({
      success: true,
      results: docs,
    });
  },
  {
    name: "searchInfo",
    description:
      "Search the store's informational policies and support content by semantic similarity. Use this when a customer asks about privacy, return policy, delivery, terms, or other store policies.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The customer's question or keywords about policies, such as 'return policy' or 'delivery time'"
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(3)
        .describe("Maximum number of results to return"),
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
