import { TOKEN } from "./constants.ts";
import { fetchLanguageStats, sanitizeUsername } from "./github_client.ts";
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

		const sanitizedUsername = sanitizeUsername(username);
		if (!sanitizedUsername) {
			return new Response("Invalid username", { status: 400 });
		}

		const data = await fetchLanguageStats(sanitizedUsername, TOKEN).catch(
			(error) => {
				console.error(
					`Error fetching language stats for user ${sanitizedUsername}:`,
					error,
				);
				return null;
			},
		);

		if (!data) {
			return new Response("Failed to fetch language statistics", {
				status: 500,
			});
		}

		const svg = await generateSVG({
			username: sanitizedUsername.toUpperCase(),
			languages: data,
		}).catch((error) => {
			console.error(
				`Error generating SVG for user ${sanitizedUsername}:`,
				error,
			);
			return null;
		});

		if (!svg) {
			return new Response("Failed to generate SVG", { status: 500 });
		}

		return new Response(svg, {
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	}

	return new Response("Not Found", { status: 404 });
}
