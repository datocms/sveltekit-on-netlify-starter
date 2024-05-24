import { purgeCache } from '@netlify/functions';

export async function invalidateCacheTags(cacheTags: CacheTag[]) {
	await purgeCache({
		tags: cacheTags
	});
}
