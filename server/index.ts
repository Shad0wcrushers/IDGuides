import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables from .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// Example: Get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Example: Create a user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Could not create user", details: error });
  }
});

// Update user role
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Could not update user role", details: error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
