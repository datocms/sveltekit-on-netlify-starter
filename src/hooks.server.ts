import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!process.env.NETLIFY) {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%page.build-info%', '')
		});
	}

	const currentTime = new Date();
	const buildId = process.env.BUILD_ID;
	const gitCommitSha = process.env.COMMIT_REF;

	const pageBuildInfo = `
    <div>
      <p>Page info: built on ${currentTime.toISOString()}, from build ${buildId} and git SHA ${gitCommitSha}.</p>
    </div>
  `;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%page.build-info%', pageBuildInfo)
	});
};
