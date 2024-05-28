import { error, json } from '@sveltejs/kit';

import { WEBHOOK_TOKEN } from '$env/static/private';

import { type CacheTag } from '$lib/cache-tags';
import { invalidateCacheTags } from '$lib/netlify-invalidation-strategy';

import type { RequestHandler } from './$types';

/**
 * This `POST` function generates an API endpoint that will be used
 * to invalidate the pages.
 *
 * See: https://kit.svelte.dev/docs/routing#server
 */
export const POST: RequestHandler = async ({ request }) => {
	if (request.headers.get('Webhook-Token') !== WEBHOOK_TOKEN) {
		return error(401, `This endpoint requires an "Webhook-Token" header with a secret token.`);
	}

	// Read the request content: that's a comma separated list of cache tags sent
	// by DatoCMS as the body of the webhook.
	const body = await request.text();

	const data = JSON.parse(body);

	const cacheTags = data['entity']['attributes']['tags'].map((tag: string) => tag as CacheTag);

	await invalidateCacheTags(cacheTags);

	return json({ cacheTags });
};
