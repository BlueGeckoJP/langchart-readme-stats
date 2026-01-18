export function requestHandler(req: Request): Response {
	const url = new URL(req.url);
	const path = url.pathname;

	if (path === "/health" && req.method === "GET") {
		return new Response("Health Check OK", { status: 200 });
	}

	return new Response("Not Found", { status: 404 });
}
