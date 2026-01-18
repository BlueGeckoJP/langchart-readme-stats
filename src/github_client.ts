import database from "./database.ts";

type LanguageQueryResponse = {
	data: {
		user: {
			repositories: {
				nodes: Array<{
					languages: {
						edges: Array<{
							size: number;
							node: {
								name: string;
							};
						}>;
					};
				}>;
			};
		};
	};
};

const languageQuery = `
  query ($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchLanguageStats(
	username: string,
	token: string,
): Promise<Map<string, number> | null> {
	const db = database;
	const shouldRefetch = await db.shouldRefetch(username);

	if (!shouldRefetch) {
		const cachedStats = await db.getLanguageStats(username);
		if (cachedStats) {
			return cachedStats;
		}
	}

	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		body: JSON.stringify({
			query: languageQuery,
			variables: { login: username },
		}),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const result = (await response.json()) as LanguageQueryResponse;

	if (!response.ok) {
		const responseText = await response.text();
		const errorData =
			responseText.length <= 300
				? responseText
				: `${responseText.slice(0, 300)}...`;
		throw new Error(`GitHub API error: ${errorData}`);
	}

	const languageStats = new Map<string, number>();

	for (const repo of result.data.user.repositories.nodes) {
		for (const langEdge of repo.languages.edges) {
			const langName = langEdge.node.name;
			const langSize = langEdge.size;

			const currentSize = languageStats.get(langName);
			if (currentSize !== undefined) {
				languageStats.set(langName, currentSize + langSize);
			} else {
				languageStats.set(langName, langSize);
			}
		}
	}

	await db.setLanguageStats(username, languageStats);

	return languageStats;
}
