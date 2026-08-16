import { customAlphabet } from "nanoid";

const SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export const generateSlug = customAlphabet(SLUG_ALPHABET, 10);
export const generateEditToken = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  32
);
