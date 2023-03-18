import { AnalyzeExpenseCommandOutput, LineItemFields } from "@aws-sdk/client-textract";
import { Prisma } from "@prisma/client";
import _ from "lodash";
import { STATES } from "../configs/states.js";
import prisma from "../lib/prisma.js";

export async function mapParsedReceiptToDbSchema({ items, summary }: ParsedReceipt) {
  const mappedItems = items.map(mapParsedLineItemToDbSchema);
  const mappedSummary = mapParsedSummaryToDbSchema(summary);
  return await prisma.receipt.create({
    data: {
      ...mappedSummary,
      lineItems: { createMany: { data: mappedItems } },
    },
  });
}

export default function parseReceipt(awsReceiptInfo: AnalyzeExpenseCommandOutput) {
  const summary: ParsedSummary = {};
  const items: ParsedLineItem[] = [];

  awsReceiptInfo.ExpenseDocuments?.map((doc) => {
    doc.LineItemGroups?.map((groups) => {
      groups.LineItems?.map((item) => {
        items.push(parseLineItem(item));
      });
    });
    doc.SummaryFields?.map((field) => {
      if (field.Type?.Text && field.ValueDetection?.Text) {
        summary[field.Type?.Text] = field.ValueDetection?.Text;
      }
    });
  });
  return { summary, items };
}

function parseLineItem(lineItem: LineItemFields): ParsedLineItem {
  const formattedLineItem = {} as { [key: string]: string };
  lineItem.LineItemExpenseFields?.map((field) => {
    if (field.Type?.Text && field.ValueDetection?.Text) {
      formattedLineItem[field.Type?.Text] = field.ValueDetection?.Text;
    }
  });
  return {
    QUANTITY: "1",
    UNIT_PRICE: formattedLineItem.PRICE,
    ...formattedLineItem,
  };
}

function mapParsedLineItemToDbSchema(lineItem: ParsedLineItem): MappedLineItem {
  return {
    name: _.startCase(_.capitalize(_.startCase(lineItem.ITEM ?? undefined))),
    unitPrice: nullOrConvertToCents(lineItem.UNIT_PRICE),
    totalPrice: nullOrConvertToCents(lineItem.PRICE),
    quantity: lineItem.QUANTITY ? parseInt(lineItem.QUANTITY) : undefined,
    venderCode: lineItem.PRODUCT_CODE,
    currency: lineItem.CURRENCY ?? undefined,
  };
}

function mapParsedSummaryToDbSchema(summary: ParsedSummary): MappedSummary {
  return {
    total: nullOrConvertToCents(summary.TOTAL),
    date: summary.INVOICE_RECEIPT_DATE
      ? new Date(summary.INVOICE_RECEIPT_DATE).toISOString()
      : null,
    tax: nullOrConvertToCents(summary.TAX),
    amountPaid: nullOrConvertToCents(summary.AMOUNT_PAID),
    discountTotal: nullOrConvertToCents(summary.DISCOUNT),
    vendorName: _.startCase(_.capitalize(_.startCase(summary.VENDOR_NAME ?? undefined))),
    street: _.startCase(_.capitalize(_.startCase(summary.STREET ?? undefined))),
    city: _.startCase(_.capitalize(_.startCase(summary.CITY ?? undefined))),
    state: _.findKey(
      STATES,
      (name) => _.lowerCase(name) === _.lowerCase(summary.STATE ?? undefined)
    ),
    vendorReceiptId: summary.INVOICE_RECEIPT_ID,
  };
}

function nullOrConvertToCents(dollarAmount: string | null) {
  // check if string
  if (typeof dollarAmount !== "string") return undefined;

  // gets regex match for ***.** (123,345.00) to clean from $123,345.00
  const [withPeriodMatch] = dollarAmount.match(/[0-9]*\.[0-9][0-9]/) ?? [undefined];
  if (withPeriodMatch) return parseInt(withPeriodMatch.replace(".", ""));
  const [withoutPeriodMatch] = dollarAmount.match(/[0-9]*\.[0-9][0-9]/) ?? [undefined];
  if (withoutPeriodMatch) return parseInt(withoutPeriodMatch) * 100;

  return undefined;
}
type ParsedLineItem = {
  QUANTITY: string;
  UNIT_PRICE: string | null;
  [key: string]: string | null;
};

type ParsedSummary = {
  [key: string]: string | null;
};

type ParsedReceipt = {
  summary: ParsedSummary;
  items: ParsedLineItem[];
};

type MappedLineItem = Omit<Prisma.LineItemCreateInput, "receipt">;
type MappedSummary = Prisma.ReceiptCreateInput;
