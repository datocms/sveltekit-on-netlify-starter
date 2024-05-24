import type { PageServerLoad } from './$types';

import { executeQuery } from '$lib/fetch-contents';

const CURRENT_POST_QUERY = `
  query CurrentPost($slug: String) {
    currentPost: post(filter: { slug: { eq: $slug }}) {
      slug
      title
      content {
        value
      }
      _firstPublishedAt
    }
  }
`;

const PREVIOUS_AND_NEXT_POSTS_QUERY = `
  query PreviousAndNextPosts($firstPublishedAt: DateTime, $slug: String) {
    previousPost: post(
      orderBy: _firstPublishedAt_DESC,
      filter: {slug: {neq: $slug}, _firstPublishedAt: {lt: $firstPublishedAt}}
    ) {
      id
      title
      slug
      _status
      _firstPublishedAt
    }
    
    nextPost: post(
      orderBy: _firstPublishedAt_ASC,
      filter: {slug: {neq: $slug}, _firstPublishedAt: {gt: $firstPublishedAt}}
    ) {
      id
      title
      slug
      _status
      _firstPublishedAt
    }
  }
`;

export const load: PageServerLoad = async function ({ url, fetch, params, setHeaders, parent }) {
	const { pathname } = url;
	const { slug } = params;

	const { data: currentPostData, tags: currentPostTags } = await executeQuery(
		pathname,
		fetch,
		CURRENT_POST_QUERY,
		{ slug }
	);

	const { currentPost } = currentPostData;
	const { _firstPublishedAt: firstPublishedAt } = currentPost;

	const { data: previousAndNextPostsData, tags: previousAndNextPostsTags } = await executeQuery(
		pathname,
		fetch,
		PREVIOUS_AND_NEXT_POSTS_QUERY,
		{ firstPublishedAt, slug }
	);

	const { previousPost, nextPost } = previousAndNextPostsData;

	const pageCacheTags = [...currentPostTags, ...previousAndNextPostsTags];

	const { layoutCacheTags } = await parent();

	setHeaders({
		'Cache-Control': 'public, max-age=0, must-revalidate',
		'Cache-Tag': [...new Set([...layoutCacheTags, ...pageCacheTags])].join(',')
	});

	return { currentPost, previousPost, nextPost, pageCacheTags };
};
