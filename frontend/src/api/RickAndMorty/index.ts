import axios from "axios";
import { getCharactersResponseSchema } from "./schema";

const { get, post, put, delete: destory } = axios.create();

export const getCharacters = async () => {
  const { data } = await get("api/character");
  return getCharactersResponseSchema.parse(data);
};
