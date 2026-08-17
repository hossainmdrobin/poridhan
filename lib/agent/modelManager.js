import { GoogleGenAI } from '@google/genai';
import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';
dotenv.config();

export async function groqEmbed(text) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const embeddings = result.embeddings?.map(e => e.values) || [];

  if (Array.isArray(text)) {
    return embeddings;
  }

  return embeddings[0];
}

/**
 * ModelManager handles automatic model switching when rate limits are reached
 * Maintains a queue of models and tracks their status
 */
class ModelManager {
  constructor(tools = []) {
    this.tools = tools;
    this.modelConfigs = [
      {
        name: 'llama-3.1-70b-versatile',
        apiKey: process.env.GROQ_API_KEY || "placeholder_for_build",
        temperature: 0.9,
        maxTries: 1, // Avoid cascading retries within ChatGroq
      },
      {
        name: 'llama-3.1-8b-instant',
        apiKey: process.env.GROQ_API_KEY || "placeholder_for_build",
        temperature: 0.9,
        maxTries: 1,
      },
      {
        name: 'mixtral-8x7b-32768',
        apiKey: process.env.GROQ_API_KEY || "placeholder_for_build",
        temperature: 0.9,
        maxTries: 1,
      },
    ];

    // Track which models are rate limited and when they can be retried
    this.rateLimitedModels = new Map(); // { modelName: { until: timestamp, attempts: count } }

    // Current model index
    this.currentModelIndex = 0;

    // Initialize the first model
    this.currentModel = this.createModel(this.modelConfigs[this.currentModelIndex]);
  }

  /**
   * Generate embeddings for the given text using Groq's embedding API
   */
  async embed(text) {
    return groqEmbed(text);
  }

  /**
   * Create a ChatGroq instance for a given model config
   */
  createModel(config) {
    const model = new ChatGroq({
      apiKey: config.apiKey,
      model: config.name,
      temperature: config.temperature,
      maxTries: config.maxTries,
    });

    // Bind tools if available
    if (this.tools && this.tools.length > 0) {
      return model.bindTools(this.tools);
    }
    return model;
  }

  /**
   * Check if a model is currently rate limited
   */
  isModelRateLimited(modelName) {
    const limitInfo = this.rateLimitedModels.get(modelName);
    if (!limitInfo) return false;

    const now = Date.now();
    // If the rate limit window has passed, remove it
    if (now > limitInfo.until) {
      this.rateLimitedModels.delete(modelName);
      console.log(`[ModelManager] Rate limit for ${modelName} has expired. Retrying.`);
      return false;
    }
    return true;
  }

  /**
   * Mark a model as rate limited
   */
  markModelRateLimited(modelName, retryAfterSeconds = 60) {
    const now = Date.now();
    const until = now + (retryAfterSeconds * 1000);

    const limitInfo = this.rateLimitedModels.get(modelName) || { attempts: 0 };
    limitInfo.until = until;
    limitInfo.attempts = (limitInfo.attempts || 0) + 1;

    this.rateLimitedModels.set(modelName, limitInfo);

    const waitTime = Math.ceil((until - now) / 1000);
    console.log(`[ModelManager] ${modelName} rate limited. Will retry after ${waitTime}s (attempt ${limitInfo.attempts})`);
  }

  /**
   * Check if an error is a rate limit error
   */
  isRateLimitError(error) {
    if (!error) return false;

    const errorMessage = error.message || error.toString();
    const errorStatus = error.status || error.statusCode;

    // Check for common rate limit indicators
    return (
      errorStatus === 429 ||
      errorStatus === '429' ||
      errorMessage.includes('429') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('Rate limit') ||
      errorMessage.includes('too many requests') ||
      errorMessage.includes('Too many requests') ||
      errorMessage.toLowerCase().includes('quota exceeded')
    );
  }

  /**
   * Get the next available model, skipping rate-limited ones
   */
  getNextAvailableModel() {
    const totalModels = this.modelConfigs.length;
    let attempts = 0;

    while (attempts < totalModels) {
      const currentModelName = this.modelConfigs[this.currentModelIndex].name;

      if (!this.isModelRateLimited(currentModelName)) {
        return {
          model: this.currentModel,
          config: this.modelConfigs[this.currentModelIndex],
          index: this.currentModelIndex,
        };
      }

      // Move to next model
      this.currentModelIndex = (this.currentModelIndex + 1) % totalModels;
      this.currentModel = this.createModel(this.modelConfigs[this.currentModelIndex]);
      attempts++;
    }

    // All models are rate limited, wait and return primary model
    console.warn('[ModelManager] All models are rate limited. Waiting before retry...');
    return {
      model: this.currentModel,
      config: this.modelConfigs[this.currentModelIndex],
      index: this.currentModelIndex,
    };
  }

  /**
   * Get current model info
   */
  getCurrentModelInfo() {
    return {
      name: this.modelConfigs[this.currentModelIndex].name,
      index: this.currentModelIndex,
      isRateLimited: this.isModelRateLimited(this.modelConfigs[this.currentModelIndex].name),
    };
  }

  /**
   * Invoke a model with automatic fallback on rate limits
   */
  async invoke(messages, maxRetries = 3) {
    let lastError = null;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const { model, config, index } = this.getNextAvailableModel();

        console.log(`[ModelManager] Using model: ${config.name} (attempt ${retryCount + 1}/${maxRetries})`);

        const response = await model.invoke(messages);

        // Success! Reset rate limit tracking for this model if it was previously limited
        this.rateLimitedModels.delete(config.name);

        return response;
      } catch (error) {
        lastError = error;

        if (this.isRateLimitError(error)) {
          const currentModelName = this.modelConfigs[this.currentModelIndex].name;

          // Extract retry-after header if available
          const retryAfter = error.response?.headers?.get?.('retry-after') ||
            error.retryAfter ||
            60;

          this.markModelRateLimited(currentModelName, parseInt(retryAfter));

          // Move to next model
          this.currentModelIndex = (this.currentModelIndex + 1) % this.modelConfigs.length;
          this.currentModel = this.createModel(this.modelConfigs[this.currentModelIndex]);

          retryCount++;

          // Wait a bit before retrying with next model (exponential backoff)
          const waitTime = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
          console.log(`[ModelManager] Rate limited. Switching models. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          // Non-rate-limit error, don't retry
          throw error;
        }
      }
    }

    // All retries exhausted
    console.error('[ModelManager] All model retry attempts exhausted');
    throw lastError;
  }

  /**
   * Get status of all models
   */
  getStatus() {
    return {
      currentModel: this.modelConfigs[this.currentModelIndex].name,
      models: this.modelConfigs.map((config, index) => ({
        name: config.name,
        isActive: index === this.currentModelIndex,
        isRateLimited: this.isModelRateLimited(config.name),
        rateLimitInfo: this.rateLimitedModels.get(config.name),
      })),
    };
  }
}

export default ModelManager;
