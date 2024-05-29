import { createHash } from 'crypto';

import { executeQuery } from '$lib/fetch-contents';

import type { PageServerLoad } from './$types';

const QUERY = `
  {
    allPosts(orderBy: _firstPublishedAt_DESC) {
      title
      slug
      _firstPublishedAt
    }
  }
`;

export const load: PageServerLoad = async function ({ url, fetch, setHeaders, parent }) {
	const { pathname } = url;

	const { data, tags } = await executeQuery(pathname, fetch, QUERY);

	const { allPosts } = data;

	const pageCacheTags = tags;

	const { layoutCacheTags } = await parent();

	const allTagsAsString = [...new Set([...layoutCacheTags, ...pageCacheTags])]
		.sort((a, b) => (a > b ? 1 : -1))
		.join(',');

	const etag = createHash('md5').update(allTagsAsString).digest('hex');

	setHeaders({
		'Netlify-CDN-Cache-Control': 'public, max-age=31536000, s-maxage=31536000, must-revalidate',
		'Netlify-Cache-Tag': allTagsAsString,
		ETag: etag
	});

	return { allPosts, pageCacheTags, etag };
};
