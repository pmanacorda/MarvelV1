import CryptoJS from "crypto-js";
import { ApiResponse } from "../models/api";

const PUBLIC_KEY: string = "61a5ca5adf4d0be464106914189269eb";
const PRIVATE_KEY: string = ""; // TODO: Set private key
const BASE_URL: string = "http://gateway.marvel.com/v1";

export var CACHE: Map<string, ApiResponse> = new Map();

const authResolver = {
  get auth() {
    const ts = Date.now();
    const hash = CryptoJS.MD5(`${ts}${PRIVATE_KEY}${PUBLIC_KEY}`).toString();
    return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
  },
};
const auth = authResolver.auth;

export async function fetchHeroes(
  search: string,
  signal: AbortSignal,
): Promise<ApiResponse> {
  let query: string = `limit=3`;
  if (search.length > 0) {
    query += `&nameStartsWith=${search.toUpperCase()}`;
  }
  let requestPath: string = `${BASE_URL}/public/characters?${query}`;
  let cached = CACHE.get(requestPath);
  if (cached) {
    return cached;
  }
  try {
    const response: Response = await fetch(`${requestPath}&${auth}`, {
      signal,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch heroes");
    }
    const heroes: ApiResponse = await response.json();

    
  console.log(`Saving ${requestPath}`);
    CACHE.set(requestPath, heroes);

    return heroes;
  } catch (error: any) {
    throw error;
  }
}

export async function fetchComics(character: string) {
  let query: string = `limit=3`;
  let requestPath: string = `${BASE_URL}/public/characters/${character.toLocaleUpperCase()}/comics?${query}`;
  let cached = CACHE.get(requestPath);
  if (cached) {
    return cached;
  }
  const response: Response = await fetch(`${requestPath}&${auth}`);
  if (!response.ok) {
    throw new Error("Failed to fetch comics");
  }
  const comics: ApiResponse = await response.json();

  CACHE.set(requestPath, comics);

  return comics;
}
