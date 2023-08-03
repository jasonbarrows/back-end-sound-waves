import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  getWaveById,
  getWaves,
  storeWave,
} from "./db/controllers/waves.controller";
import cors from "cors";
import multer from "multer";
import { getBoards } from "./db/controllers/boards.controller";
import { getCommentsByWaveId } from "./db/controllers/comments.controller";

dotenv.config();

const app: Express = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/waves", getWaves);

app.post("/api/waves", upload.single("audio_file"), storeWave);

app.get("/api/boards", getBoards);

app.get("/api/waves/:wave_id/comments", getCommentsByWaveId);

app.get("/api/waves/:wave_id", getWaveById);

module.exports = app;
