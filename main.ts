import { requestHandler } from "@/request_handler.ts";

Deno.serve({ port: 8000 }, (req) => requestHandler(req));
