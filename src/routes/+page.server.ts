import { executeQuery } from '$lib/fetch-contents';

import { dontExpireAndAllowRegeneration } from '$lib/incremental-static-regeneration';

import type { PageServerLoad } from './$types';

export const config = {
	isr: dontExpireAndAllowRegeneration
};

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

	setHeaders({ 'Cache-Tag': [...new Set([...layoutCacheTags, ...pageCacheTags])].join(',') });

	return { allPosts, pageCacheTags };
};
