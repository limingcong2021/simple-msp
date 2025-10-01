import { validators as mspValidators, referenceMap as mspRefs } from './msp-data';

export default {
	async fetch(request, _env, _ctx): Promise<Response> {
		const url = new URL(request.url);
		const fullPath = url.pathname + url.search;

		const splitIndex = fullPath.indexOf('/', 1);
		if (splitIndex == -1) {
			return new Response('Unknown Service', { status: 400 });
		}

		const service = fullPath.substring(1, splitIndex) as keyof typeof mspValidators;
		const path = fullPath.substring(splitIndex);

		if (
			!mspValidators[service] ||
			!mspValidators[service].some(it => {
				const { urlMatch, method } = it;
				if (request.method != method) {
					return false;
				}

				if (typeof urlMatch == 'string') {
					return urlMatch == path;
				}

				if (urlMatch instanceof RegExp) {
					return urlMatch.test(path);
				}

				if (urlMatch instanceof Function) {
					return urlMatch(path);
				}

				return false;
			})
		) {
			return new Response('Invalid URL Spec or Method', { status: 400 });
		}

		const requestInfo: RequestInit = {
			method: request.method,
			headers: {
				...Object.fromEntries(request.headers.entries()),
				'content-type': 'application/json'
			}
		};

		if (request.method == 'POST') {
			requestInfo.body = await request.text();
		}

		const resp = await globalThis.fetch(`https://${mspRefs[service]}${path}`, requestInfo);
		return new Response(resp.body, {
			status: resp.status,
			statusText: resp.statusText,
			headers: resp.headers
		});
	}
} satisfies ExportedHandler<Env>;
