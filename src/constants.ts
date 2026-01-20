const TOKEN_KEY = "GITHUB_TOKEN";

export const TOKEN = (() => {
	const token = Deno.env.get(TOKEN_KEY);
	if (!token) {
		throw new Error(
			`Environment variable ${TOKEN_KEY} is not set. Please set it to your GitHub Personal Access Token.`,
		);
	}
	return token;
})();

export const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
