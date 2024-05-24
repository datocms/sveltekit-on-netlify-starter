import { PUBLIC_DATOCMS_API_TOKEN } from '$env/static/public';

import { parseCommaSeparatedTagString } from './cache-tags';

type Fetch = typeof fetch;

/**
 * `executeQuery` uses `fetch` (passed as a parameter) to make a request to the
 * DatoCMS GraphQL API
 */
export async function executeQuery(pathname: string, fetch: Fetch, query = '', variables = {}) {
	if (!query) {
		throw new Error(`Query is not valid`);
	}

	const response = await fetch('https://graphql.datocms.com/', {
		method: 'POST',
		// Headers are used to instruct DatoCMS on how to treat the request:
		headers: {
			// - No token, no party: only authorized requests return data
			Authorization: `Bearer ${PUBLIC_DATOCMS_API_TOKEN}`,
			// - Only return valid record
			'X-Exclude-Invalid': 'true',
			// - Finally, return the cache tags together with the content.
			'X-Cache-Tags': 'true'
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch data: ${JSON.stringify(response)}`);
	}

	const { data, errors } = await response.json();

	if (errors) {
		throw new Error(`Something went wrong while executing the query: ${JSON.stringify(errors)}`);
	}

	/**
	 * Converts the string of cache tags received via headers into an array of
	 * tags of `CacheTag` type.
	 */
	const tags = parseCommaSeparatedTagString(response.headers.get('x-cache-tags'));

	return { data, tags };
}
