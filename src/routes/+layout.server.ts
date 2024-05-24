import { executeQuery } from '$lib/fetch-contents';

import type { LayoutServerLoad } from './$types';

const QUERY = `
  {
    meta: _allPostsMeta{
      count
    }
  }
`;

export const load: LayoutServerLoad = async function ({ url, fetch }) {
	const { pathname } = url;

	const { data, tags } = await executeQuery(pathname, fetch, QUERY);

	const { meta } = data;

	const layoutCacheTags = tags;

	return { meta, layoutCacheTags };
};
