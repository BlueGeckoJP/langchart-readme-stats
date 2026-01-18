import { fetchLanguageStats } from "./github_client.ts";
import { TOKEN } from "./token.ts";

export async function requestHandler(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const path = url.pathname;

	if (path === "/health" && req.method === "GET") {
		return new Response("Health Check OK", { status: 200 });
	}

	if (path === "/" && req.method === "GET") {
		const username = url.searchParams.get("username");
		if (!username) {
			return new Response("Username query parameter is required", {
				status: 400,
			});
		}

		const token = TOKEN;
		if (!token) {
			console.error("Error: GitHub token not set");
			return new Response("GitHub token not set", { status: 500 });
		}

		const data = await fetchLanguageStats(username, token);

		return new Response("Request processed", { status: 200 });
	}

	return new Response("Not Found", { status: 404 });
}
