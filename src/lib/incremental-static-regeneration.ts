import { REVALIDATE_TOKEN } from '$env/static/private';

/**
 * [Vercel is able][isr] to store rendered pages in a long-lasting cache. We're
 * gonna leverage this feature to avoid rendering the pages each they are
 * requested: they're gonna be rendered and stored only when not available in
 * the cache.
 *
 * In SvelteKit, we enable the behaviour by `export`ing a specific value from
 * the pages that we want to be cached. Since we're gonna use the same value of
 * different pages of the starter, we store here this default configuration.
 *
 * [isr]: https://vercel.com/docs/frameworks/sveltekit#incremental-static-regeneration-isr
 */
export const dontExpireAndAllowRegeneration = {
	// Expiration time (in seconds) before the cached asset will be re-generated.
	// Setting the value to `false` means it will never expire.
	expiration: false,

	// For security reasons, a token must be provided in the URL to tell Vercel a
	// page is not valid anymore and it must be re-rendered.
	//
	// Making a `GET` or `HEAD` request with `x-prerender-revalidate: <token>`
	// header will force the asset to be re-validated.
	//
	// See: [vercel-regeneration-strategy.ts](./vercel-regeneration-strategy.ts)
	bypassToken: REVALIDATE_TOKEN
};
