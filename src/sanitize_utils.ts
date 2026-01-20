export function sanitizeSizeParam(
	widthStr: string | null,
	heightStr: string | null,
): [number, number] {
	const defaultWidth = 360;
	const defaultHeight = 320;

	let width = widthStr ? parseInt(widthStr, 10) : defaultWidth;
	let height = heightStr ? parseInt(heightStr, 10) : defaultHeight;

	if (Number.isNaN(width) || width < 100 || width > 2000) {
		width = defaultWidth;
	}

	if (Number.isNaN(height) || height < 100 || height > 2000) {
		height = defaultHeight;
	}

	return [width, height];
}

export function sanitizeUsername(username: string): string | null {
	if (!username || typeof username !== "string") {
		return null;
	}

	username = username.trim();

	if (username.length === 0 || username.length > 39) {
		return null;
	}

	if (username.includes("..") || username.includes("/")) {
		return null;
	}

	const validPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
	if (!validPattern.test(username)) {
		return null;
	}

	return username;
}
