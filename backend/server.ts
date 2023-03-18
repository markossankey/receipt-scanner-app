import axios from "axios";
import express from "express";
import { readdir, readFile } from "fs";
import multer from "multer";
import { readReceipt } from "./lib/aws-textract.js";
import prisma from "./lib/prisma.js";
import { ReceiptModel } from "./prisma/zod/receipt.js";
import receipt from "./receipts/json/scannedNexReceipt.json" assert { type: "json" };
import { dirtyLineItemPatchSchema, receiptPatchSchema } from "./schemas/index.js";
import parseReceipt, { mapParsedReceiptToDbSchema } from "./utils/parseReceipt.js";
import { validatePatch } from "./utils/validate.js";

const upload = multer();
const app = express();
const port = process.env.BACKEND_PORT;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("worked");
});

app.get("/character", async (req, res, next) => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  res.send(data);
});

app.get("/receipt/mock", (req, res, next) => {
  const parsed = parseReceipt(receipt);
  res.send(parsed);
});

app.get("/receipt", async (req, res, next) => {
  const query = req.query;
  const receipts = await prisma.receipt.findMany({ orderBy: { date: "desc" } });
  res.send(receipts);
});

app.patch("/receipt/:receiptId", validatePatch(receiptPatchSchema), async (req, res, next) => {
  const updatedReceipt = await prisma.receipt.update({
    where: { id: req.params.receiptId },
    data: req.body,
  });
  res.status(200).send(updatedReceipt);
});

app.get("/receipt/:receiptId", async (req, res, next) => {
  const receipt = await prisma.receipt.findUnique({
    where: { id: req.params.receiptId },
    include: { lineItems: { orderBy: { id: "asc" } } },
  });
  res.send(receipt);
});

app.patch(
  "/dirty-line-item/:lineItemId",
  validatePatch(dirtyLineItemPatchSchema),
  async (req, res, next) => {
    const updatedItem = await prisma.lineItem.update({
      where: { id: req.params.lineItemId },
      data: req.body,
    });
    res.status(200).send(updatedItem);
  }
);

app.post("/test/receipt", upload.single("receiptFile"), async (req, res, next) => {
  const uploadedReceiptBuffer = req.file?.buffer;
  res.status(200).send(req.file);
});

app.get("/test/receipt", async (req, res, next) => {
  res.status(200).send();
});

app.post("/receipt", upload.single("receiptFile"), async (req, res, next) => {
  //! Create a way t handle multi-page PDFs
  const uploadedReceiptBuffer = req.file?.buffer;
  const textractReceipt = await readReceipt(uploadedReceiptBuffer);
  const parsedReceipt = parseReceipt(textractReceipt);
  // const parsedReceipt = parseReceipt(receipt);
  const storedReceipt = await mapParsedReceiptToDbSchema(parsedReceipt);
  res.status(200).send(storedReceipt);
});

app.post("/test", async (req, res, next) => {
  const user = await prisma.user.create({
    data: { firstName: "first", lastName: "last" },
  });
  res.status(201).send(user);
});

app.get("/test/load-receipts", async (req, res, next) => {
  const receipts: Array<Promise<any>> = [];
  readdir("./receipts/json", async (err, files) => {
    if (err) {
      console.log("error reading files in ./receipts/json");
      return res.status(500).send();
    } else if (files.length > 0) {
      files.map(async (fileName) => {
        readFile(`./receipts/json/${fileName}`, "utf-8", (err, data) => {
          if (err) {
            console.log(`error reading file: ${fileName}`);
            return res.status(500).send(`error reading file: ${fileName}`);
          }
          if (data) {
            const receiptJson = JSON.parse(data);
            const parsedReceipt = parseReceipt(receiptJson);
            const storedReceipt = mapParsedReceiptToDbSchema(parsedReceipt);
            receipts.push(storedReceipt);
          }
        });
      });
    }
  });
  const loadedReceipts = await Promise.all(receipts);
  res.send(loadedReceipts);
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
