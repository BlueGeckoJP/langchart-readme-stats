import { UPDATE_INTERVAL_MS } from "./constants.ts";

type Payload = {
	updatedAt: number;
	languages: Map<string, number>;
};

export class Database {
	private kv: Deno.Kv;

	constructor(kv: Deno.Kv) {
		this.kv = kv;
	}

	static async create(): Promise<Database> {
		const kv = await Deno.openKv();
		return new Database(kv);
	}

	async get(username: string): Promise<Payload | null> {
		const result = await this.kv.get<Payload>(["user", username]);
		return result.value || null;
	}

	async set(username: string, payload: Payload): Promise<void> {
		await this.kv.set(["user", username], payload);
	}

	async getLanguageStats(
		username: string,
	): Promise<Map<string, number> | null> {
		const payload = await this.get(username);
		return payload ? payload.languages : null;
	}

	async setLanguageStats(
		username: string,
		languages: Map<string, number>,
	): Promise<void> {
		const payload: Payload = {
			updatedAt: Date.now(),
			languages,
		};
		await this.set(username, payload);
	}

	async shouldRefetch(username: string): Promise<boolean> {
		const payload = await this.get(username);
		if (!payload) {
			return true;
		}
		const nowTime = Date.now();
		return nowTime - payload.updatedAt > UPDATE_INTERVAL_MS;
	}
}

const database = await Database.create();
export default database;
