import { Router, Request, Response } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";
import { searchTavily } from "../services/search";
import { generateAnswer, streamAnswer } from "../services/llm";

const router = Router();

// Apply the auth middleware so only logged-in users can search
router.post("/", requireAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, conversationId } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'query' field in request body" });
    }

    console.log(`[Search] User ${req.user.email} is searching for: "${query}" in convo: ${conversationId || 'new'}`);

    // 0. Fetch history if conversationId is provided
    let previousMessages: { role: "user" | "assistant", content: string }[] = [];
    if (conversationId) {
      const convo = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      
      if (!convo) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      if (convo.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden: You don't own this conversation" });
      }
      
      previousMessages = convo.messages.map(m => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content
      }));
    }

    // 1. Get search results
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const conversationalTriggers = [
      "hello", "hi", "hi there", "hey",
      "how are you spark ai", "how are you", 
      "lift up my mood", "lift me up", 
      "thank you", "thanks", 
      "just want to chat", "i just want to chat", 
      "just want to talk", "i just want to talk",
      "who made you", "who created you", "who owns you", "what is your name"
    ];

    let searchResults: any[] = [];
    if (!conversationalTriggers.includes(normalizedQuery)) {
      searchResults = await searchTavily(query);
    }

    // 2. Setup Server-Sent Events (SSE) stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 3. Immediately send the sources so the UI can render them
    res.write(`data: ${JSON.stringify({ type: 'sources', data: searchResults })}\n\n`);

    // 4. Stream the LLM response chunks and accumulate the final answer for saving
    console.log(`[Search] Streaming AI response...`);
    const generator = streamAnswer(query, searchResults, previousMessages);

    let fullAiResponse = "";
    for await (const chunk of generator) {
      fullAiResponse += chunk;
      res.write(`data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`);
    }

    // 5. Persist the conversation to the database
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      // Create new conversation
      const newConvo = await prisma.conversation.create({
        data: {
          userId: req.user.id,
          title: query.substring(0, 50) // Basic title
        }
      });
      activeConversationId = newConvo.id;
    }

    // Save the User's message and the AI's message
    await prisma.message.createMany({
      data: [
        {
          conversationId: activeConversationId,
          role: "USER",
          content: query
        },
        {
          conversationId: activeConversationId,
          role: "ASSISTANT",
          content: fullAiResponse
        }
      ]
    });

    res.write(`data: ${JSON.stringify({ type: 'done', conversationId: activeConversationId })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("[Search] Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "An unexpected error occurred" });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', data: error.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
