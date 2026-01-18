const TOKEN_KEY = "GITHUB_TOKEN";

export const TOKEN = Deno.env.get(TOKEN_KEY);

export const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
