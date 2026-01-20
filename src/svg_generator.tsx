// Almost Written by AI

import satori from "satori";

interface LanguageData {
	name: string;
	percentage: number;
	color: string;
}

interface StatsData {
	username: string;
	languages: Map<string, number>;
}

// Language color mapping
const LANGUAGE_COLORS: Record<string, string> = {
	// Popular languages
	Rust: "#ff6b35",
	TypeScript: "#5fa8ff",
	TS: "#5fa8ff",
	Python: "#ffd43b",
	JavaScript: "#f7df1e",
	JS: "#f7df1e",
	Java: "#f89820",
	Go: "#00add8",
	"C++": "#f34b7d",
	C: "#555555",
	"C#": "#178600",
	Ruby: "#cc342d",
	PHP: "#4f5d95",
	Swift: "#ffac45",
	Kotlin: "#a97bff",
	Dart: "#00b4ab",
	Scala: "#c22d40",

	// Web technologies
	HTML: "#e34c26",
	CSS: "#563d7c",
	SCSS: "#c6538c",
	Sass: "#c6538c",
	Less: "#1d365d",
	Vue: "#41b883",
	React: "#61dafb",
	Svelte: "#ff3e00",
	Angular: "#dd0031",

	// System & Shell
	Shell: "#89e051",
	Bash: "#89e051",
	PowerShell: "#012456",
	"Vim Script": "#199f4b",
	Lua: "#000080",
	Perl: "#0298c3",

	// Functional languages
	Haskell: "#5e5086",
	Elixir: "#6e4a7e",
	Erlang: "#b83998",
	OCaml: "#3be133",
	F: "#b845fc",
	Clojure: "#db5855",

	// JVM languages
	Groovy: "#4298b8",

	// .NET languages
	"Visual Basic": "#945db7",
	VB: "#945db7",
	"F#": "#b845fc",

	// Database & Query
	SQL: "#e38c00",
	PLSQL: "#dad8d8",
	TSQL: "#e38c00",

	// Data & Config
	JSON: "#292929",
	YAML: "#cb171e",
	TOML: "#9c4121",
	XML: "#0060ac",

	// Mobile
	"Objective-C": "#438eff",
	"Objective-C++": "#6866fb",

	// Scientific & Data
	R: "#198ce7",
	Julia: "#a270ba",
	MATLAB: "#e16737",

	// Other languages
	Assembly: "#6e4c13",
	Fortran: "#4d41b1",
	Cobol: "#005ca5",
	Prolog: "#74283c",
	Lisp: "#3fb68b",
	Scheme: "#1e4aec",
	Racket: "#3c5caa",
	Zig: "#ec915c",
	Nim: "#ffc200",
	Crystal: "#000100",
	D: "#ba595e",
	Pascal: "#e3f171",
	Delphi: "#e3f171",
	Ada: "#02f88c",
	ActionScript: "#882b0f",
	CoffeeScript: "#244776",
	Elm: "#60b5cc",
	PureScript: "#1d222d",
	ReasonML: "#ff5847",
	Solidity: "#aa6746",
	WebAssembly: "#04133b",
	Markdown: "#083fa1",
	LaTeX: "#3d6117",
};

export async function generateSVG(data: StatsData): Promise<string> {
	// Calculate total bytes
	const totalBytes = Array.from(data.languages.values()).reduce(
		(sum, bytes) => sum + bytes,
		0,
	);

	// Convert Map to LanguageData array with percentages and colors
	const languageData: LanguageData[] = Array.from(data.languages.entries())
		.map(([name, bytes]) => ({
			name,
			percentage: Math.round((bytes / totalBytes) * 100),
			color: LANGUAGE_COLORS[name] || "#888888", // Default gray for unknown languages
		}))
		.sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
	const svg = await satori(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				fontFamily: '"JetBrains Mono", monospace',
				background:
					"repeating-linear-gradient(0deg, #0b0d10, #0b0d10 2px, #0e1116 3px)",
				color: "#e6e6eb",
				padding: "16px",
				width: "360px",
				border: "1px solid #2a2f3a",
				boxShadow: "0 0 0 1px #111 inset, 0 0 30px rgba(80, 120, 255, 0.15)",
				position: "relative",
			}}
		>
			{/* Gradient overlay */}
			<div
				style={{
					position: "absolute",
					top: "0px",
					left: "0px",
					right: "0px",
					bottom: "0px",
					background:
						"linear-gradient(120deg, transparent 40%, rgba(120, 160, 255, 0.08), transparent 60%)",
					pointerEvents: "none",
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					fontSize: "11px",
					opacity: 0.8,
					marginBottom: "12px",
					position: "relative",
				}}
			>
				<span style={{ display: "flex", letterSpacing: "0.12em" }}>
					LANGUAGE TELEMETRY
				</span>
				<span style={{ display: "flex", color: "#7aa2ff" }}>
					NODE: {data.username.toUpperCase()}
				</span>
			</div>

			{/* Language chart */}
			<div
				style={{
					margin: "16px 0px",
					padding: "10px",
					border: "1px dashed #3a3f4b",
					background: "rgba(42, 47, 58, 0.2)",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					position: "relative",
				}}
			>
				{/* Bar chart */}
				<div style={{ display: "flex", position: "relative" }}>
					<div
						style={{
							display: "flex",
							height: "18px",
							border: "1px solid #2a2f3a",
							overflow: "hidden",
							flex: 1,
						}}
					>
						{languageData.map((lang, index) => (
							<div
								key={lang.name}
								style={{
									width: `${lang.percentage}%`,
									height: "100%",
									borderRight:
										index < languageData.length - 1
											? "1px solid #0e1116"
											: "none",
									position: "relative",
									background: lang.color,
									display: "flex",
								}}
							/>
						))}
					</div>
				</div>

				{/* Legend */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "8px",
						height: "40px",
						overflow: "hidden",
					}}
				>
					{languageData.map((lang) => (
						<div
							key={lang.name}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								fontSize: "10px",
							}}
						>
							<span
								style={{
									width: "6px",
									height: "6px",
									borderRadius: "1px",
									background: lang.color,
									display: "flex",
								}}
							/>
							<span
								style={{
									color: "#9aa0aa",
									letterSpacing: "0.1em",
									display: "flex",
								}}
							>
								{lang.name.toUpperCase()}
							</span>
							<span
								style={{ color: "#e6e6eb", fontWeight: 600, display: "flex" }}
							>
								{lang.percentage}%
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Languages list */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					border: "1px dashed #3a3f4b",
					padding: "10px",
					position: "relative",
					width: "100%",
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: "10px",
						letterSpacing: "0.15em",
						color: "#9aa0aa",
						marginBottom: "6px",
					}}
				>
					LANGUAGES
				</div>
				<div
					style={{
						display: "flex",
						fontSize: "13px",
						lineHeight: 1.4,
						fontWeight: 600,
					}}
				>
					{languageData.map((lang) => lang.name).join(" / ")}
				</div>
				<span
					style={{
						position: "absolute",
						right: "-2px",
						bottom: "-2px",
						width: "8px",
						height: "8px",
						background: "#7aa2ff",
						opacity: 0.6,
						display: "block",
					}}
				/>
			</div>

			{/* Footer */}
			<div
				style={{
					display: "flex",
					marginTop: "12px",
					fontSize: "10px",
					color: "#6b7280",
					opacity: 0.7,
					position: "relative",
				}}
			>
				<span
					style={{ display: "flex" }}
				>{`// langchart-readme-stats inside`}</span>
			</div>
		</div>,
		{
			width: 392,
			height: 520,
			fonts: [
				{
					name: "JetBrains Mono",
					data: await fetch(
						"https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.17/files/jetbrains-mono-latin-400-normal.woff",
					).then((res) => res.arrayBuffer()),
					weight: 400,
					style: "normal",
				},
				{
					name: "JetBrains Mono",
					data: await fetch(
						"https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.17/files/jetbrains-mono-latin-600-normal.woff",
					).then((res) => res.arrayBuffer()),
					weight: 600,
					style: "normal",
				},
			],
		},
	);

	return svg;
}
