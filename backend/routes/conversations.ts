import { Router, Request, Response } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// GET all conversations for the user
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific conversation and its messages
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const convo = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    
    if (!convo) return res.status(404).json({ error: "Conversation not found" });
    if (convo.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    res.json(convo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a conversation
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const convo = await prisma.conversation.findUnique({ where: { id: req.params.id } });
    if (!convo) return res.status(404).json({ error: "Conversation not found" });
    if (convo.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    await prisma.conversation.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
