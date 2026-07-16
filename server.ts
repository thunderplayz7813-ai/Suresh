import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize the Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// In-memory model health tracker to avoid slow retry/fallback cycles
interface ModelStatus {
  blacklistedUntil: number; // timestamp
}
const modelHealth: Record<string, ModelStatus> = {};

const BLACKLIST_DURATION_MS = 10 * 60 * 1000; // 10 minutes

function blacklistModel(modelName: string) {
  modelHealth[modelName] = {
    blacklistedUntil: Date.now() + BLACKLIST_DURATION_MS,
  };
}

function isModelAvailable(modelName: string): boolean {
  const status = modelHealth[modelName];
  if (!status) return true;
  return Date.now() > status.blacklistedUntil;
}

// SSE Chat Streaming Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, systemInstruction, mode, apiKey: clientApiKey } = req.body;

  const requestApiKey = clientApiKey || process.env.GEMINI_API_KEY;

  if (!requestApiKey) {
    return res.status(500).json({
      error: "Gemini API Key is not configured. Please add it in Settings > Secrets & API Keys.",
    });
  }

  const aiClient = new GoogleGenAI({
    apiKey: requestApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  try {
    // Convert client-side message format to Gemini's expected API format
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Setup headers for SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const systemPrompt = systemInstruction || "You are Sura AI, an ultra-fast, future-generation artificial intelligence platform developed by Choco Software.";

    // Setup model hierarchy using only approved Gemini 3 models
    const allModels = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    
    // Filter available models (unless all are blacklisted, then try all as safety net)
    let modelsToTry = allModels.filter(isModelAvailable);
    if (modelsToTry.length === 0) {
      modelsToTry = allModels;
    }

    let stream: any = null;
    let lastError: any = null;
    let selectedModel = "";

    for (const modelName of modelsToTry) {
      let attempts = 3;
      let delay = 800; // start with 800ms delay

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          stream = await aiClient.models.generateContentStream({
            model: modelName,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });
          selectedModel = modelName;
          break; // Stream established successfully
        } catch (err: any) {
          lastError = err;
          const status = err.status || err.code;
          const errMsg = err.message || "";
          
          const isQuotaExceeded = errMsg.includes("Quota exceeded") || 
                                  errMsg.includes("quota") || 
                                  errMsg.includes("RESOURCE_EXHAUSTED") ||
                                  status === 429;

          const isRetryable = (status === 503 || status === 429 || 
                              errMsg.includes("503") || errMsg.includes("429") ||
                              errMsg.includes("UNAVAILABLE") || errMsg.includes("Service Unavailable") ||
                              errMsg.includes("Resource exhausted") || errMsg.includes("fetch failed") ||
                              errMsg.includes("high demand")) && !isQuotaExceeded;

          console.log(`[Sura Engine] Model ${modelName} attempt ${attempt} status (isQuotaExceeded: ${isQuotaExceeded})`);

          if (isQuotaExceeded) {
            console.log(`[Sura Engine] Quota exceeded for model ${modelName}. Blacklisting for 10 minutes and trying fallback...`);
            blacklistModel(modelName);
            break; // Skip further retries on this model
          }

          if (attempt < attempts && isRetryable) {
            console.log(`[Sura Engine] Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
          } else {
            break; // Proceed to next model or fail
          }
        }
      }
      if (stream) {
        console.log(`[Sura Engine] Stream established using model: ${selectedModel}`);
        break; // Successfully connected to a model
      }
    }

    if (!stream) {
      throw lastError || new Error("Failed to connect to any Gemini models due to high service load");
    }

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Error in generateContentStream:", error);
    let errMsg = error.message || "Internal server error";
    
    if (errMsg.includes("Quota exceeded") || errMsg.includes("RESOURCE_EXHAUSTED") || error.status === 429) {
      errMsg = "Sura Engine Quota Notice: Your current session has exhausted the daily free tier request limit (20 requests per day) for the default model. To resume immediately and experience unlimited reasoning pipelines, you can add your own premium Gemini API Key in the Settings panel (or try again in a few minutes).";
    }
    
    res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    res.end();
  }
});

// Start-up function to handle Express routes + Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sura AI Server] Running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
