import express from "express";
import cors from "cors";
import prisma from "./db";
import { requireAuth } from "./middleware/auth";
import searchRouter from "./routes/search";
import conversationsRouter from "./routes/conversations";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRouter);
app.use("/api/conversations", conversationsRouter);

app.get("/", (req, res) => {
  res.send("Hello from Bun + Express!");
});

app.get("/api/me", requireAuth, async (req, res): Promise<any> => {
  const email = req.user.email;
  
  if (!email) {
    return res.status(400).json({ error: 'User does not have an email address' });
  }

  // 1. Check if the user exists in our local Postgres database
  let dbUser = await prisma.user.findUnique({
    where: { email }
  });

  // 2. Auto-provisioning: If they don't exist, create them!
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email,
        name: req.user.user_metadata?.full_name || req.user.user_metadata?.name || 'New User',
      }
    });
    console.log('✅ Auto-provisioned new user in Postgres:', dbUser.email);
  } else {
    console.log('✅ Found existing user in Postgres:', dbUser.email);
  }

  res.json({ 
    message: "Successfully authenticated!", 
    supabaseId: req.user.id,
    postgresUser: dbUser 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});