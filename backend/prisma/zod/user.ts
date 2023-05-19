import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})
