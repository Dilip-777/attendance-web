import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/uploads");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      fs.readdir(path.join(process.cwd(), "/uploads"));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd(), "/uploads"));
    }
    const options = await readFile(req, true);

    res.status(200).json({ success: "true", file: options.files.myFile });
  } else if (req.method === "GET") {
    try {
      const { fileName } = req.query;
      const session = await getSession({ req });
      if (!session?.user?.id) {
        return res.status(400).json("Access Denied");
      }
      const filePath = path.join(process.cwd(), `/uploads/${fileName}`);
      const stream = createReadStream(filePath);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};

export default handler;
