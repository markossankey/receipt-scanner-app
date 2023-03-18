import { AnalyzeExpenseCommand, TextractClient } from "@aws-sdk/client-textract";
import { writeFile } from "fs/promises";
import _ from "lodash";

const textract = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ID!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export const readReceipt = async (bitmap: Buffer | undefined) => {
  const aExpense = new AnalyzeExpenseCommand({ Document: { Bytes: bitmap } });
  const response = await textract.send(aExpense);
  // tempory while to save data without making multipel calls
  writeFile(`./receipts/json/${_.uniqueId()}.json`, JSON.stringify(response));
  return response;
};
