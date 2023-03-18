import axios from "axios";
import { z } from "zod";
import {
  lineItemSchema,
  LineItemSchema,
  ReceiptSchema,
  receiptSchema,
  receiptWithLineItemsSchema,
} from "../../schemas";

const { get, post, put, delete: destory, patch } = axios.create();

export const postReceipt = async (file: File) => {
  const formData = new FormData();
  formData.append("receiptFile", file);
  const res = await post(`api/receipt`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getReceipts = async () => {
  const { data } = await get("api/receipt");
  return z.array(receiptSchema).parse(data);
};

export const getReceiptDetails = async (receiptId: string) => {
  const { data } = await get(`api/receipt/${receiptId}`);
  console.log(data);
  return receiptWithLineItemsSchema.parse(data);
};

export const patchReceipt = async ({ receiptId, dataToUpdate }: PatchReceiptParams) => {
  const { data } = await patch(`api/receipt/${receiptId}`, dataToUpdate);
  return receiptSchema.parse(data);
};

export const patchLineItem = async ({ lineItemId, dataToUpdate }: PatchLineItemParams) => {
  const { data } = await patch(`api/dirty-line-item/${lineItemId}`, dataToUpdate);
  return lineItemSchema.parse(data);
};

export const createUser = async () => {
  const { data } = await post("api/test");
  return data;
};

export const getUsers = async () => {
  const { data } = await get("api/test");
  return data;
};

type PatchLineItemParams = {
  lineItemId: string;
  dataToUpdate: Partial<LineItemSchema>;
};

type PatchReceiptParams = {
  receiptId: string;
  dataToUpdate: Partial<ReceiptSchema>;
};
