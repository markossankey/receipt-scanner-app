import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { AnyZodObject } from "zod";

export const validatePatch =
  (bodySchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await bodySchema
        .refine((body) => !_.isEmpty(body), "body cannot be empty")
        .parse(req.body);
      return next();
    } catch (validationError) {
      return res.status(400).send(validationError);
    }
  };
