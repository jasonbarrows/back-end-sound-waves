import { Request, Response, NextFunction } from "express";
import {
  audioTranscriber,
  insertWave,
  selectWaves,
} from "../models/waves.model";
import { Wave } from "../types/soundwaves-types";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";

export const getWaves = (req: Request, res: Response, next: NextFunction) => {
  selectWaves()
    .then((waves: Wave[]) => {
      res.status(200);
      res.send({ waves });
    })
    .catch((err) => {
      console.log(err, "<<< getWaves err");
    });
};

export const storeWave = (req: Request, res: Response, next: NextFunction) => {
  const supabase = createClient(
    <string>process.env.SUPABASE_PROJECT_URL,
    <string>process.env.SUPABASE_API_KEY
  );
  const audioFilePath = `${__dirname}/../../../${req.file?.path}`;
  fs.readFile(audioFilePath)
    .then((file) => {
      return supabase.storage
        .from("waves")
        .upload(`${req.file?.filename}.webm`, file);
    })
    .then(() => {
      return audioTranscriber(audioFilePath);
    })
    .then((transcript) => {
      return insertWave(req.body, `${req.file?.filename}.webm`, transcript);
    })
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return fs.rm(audioFilePath);
    });
};

// export function receiveTranscript(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.log(req.body, "body");
// }
