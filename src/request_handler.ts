import { TOKEN } from "./constants.ts";
import { fetchLanguageStats } from "./github_client.ts";
import { generateSVG } from "./svg_generator.tsx";

export async function requestHandler(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const path = url.pathname;

	console.log(`Received request: ${req.method} ${path}`);

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
		if (!data) {
			return new Response("Failed to fetch language statistics", {
				status: 500,
			});
		}

		const svg = await generateSVG({
			username: username.toLocaleUpperCase(),
			languages: data,
		});

		return new Response(svg, {
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
			},
		});
	}

	return new Response("Not Found", { status: 404 });
}
