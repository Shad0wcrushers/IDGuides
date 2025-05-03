import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MinIO config
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";
const MINIO_ACCESS_KEY =
  process.env.MINIO_ROOT_USER || process.env.MINIO_ACCESS_KEY || "minioadmin";
const MINIO_SECRET_KEY =
  process.env.MINIO_ROOT_PASSWORD ||
  process.env.MINIO_SECRET_KEY ||
  "minioadmin";
const MINIO_BUCKET = process.env.MINIO_BUCKET || "idhosting-docs";

const s3 = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const upload = multer();
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

app.post(
  "/api/upload-image",
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const file = req.file;
      const filename = `${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: MINIO_BUCKET,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      });
      await s3.send(command);
      const imageUrl = `${MINIO_ENDPOINT.replace(
        /:\\d+$/,
        ":9000"
      )}/${MINIO_BUCKET}/${filename}`;
      res.json({ url: imageUrl });
    } catch (err) {
      next(err);
    }
  }
);

// Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user role
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { role },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
