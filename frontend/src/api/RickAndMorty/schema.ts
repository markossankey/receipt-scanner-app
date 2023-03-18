import { z } from "zod";

export const getCharactersResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().nullable(),
    prev: z.string().nullable(),
  }),
  results: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      status: z.string(),
      species: z.string(),
      type: z.string(),
      gender: z.string(),
      origin: z.object({
        name: z.string(),
        url: z.string(),
      }),
      location: z.object({
        name: z.string(),
        url: z.string(),
      }),
      image: z.string(),
      episode: z.array(z.string()),
      url: z.string(),
      created: z.string().datetime(),
    })
  ),
});
