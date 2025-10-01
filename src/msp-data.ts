interface MSPValidatationCtx {
	urlMatch: string | RegExp | ((url: string) => boolean);
	method: 'GET' | 'POST';
}

export const referenceMap = {
	account: 'api.mojang.com',
	session: 'sessionserver.mojang.com',
	services: 'api.minecraftservices.com'
} satisfies Record<string, string>;

export const validators = {
	// api.mojang.com
	account: [
		{
			urlMatch: /\/users\/profiles\/minecraft\/[A-Za-z0-9_]{2,16}$/,
			method: 'GET'
		},
		{
			urlMatch: '/profiles/minecraft',
			method: 'POST'
		}
	],

	// sessionserver.mojang.com
	session: [
		{
			urlMatch: /\/session\/minecraft\/profile\/[a-f0-9]{32}(\?unsigned=false)?/,
			method: 'GET'
		},
		{
			urlMatch: '/session/minecraft/join',
			method: 'POST'
		},
		{
			urlMatch: (url: string) => {
				if (!url.startsWith('/session/minecraft/hasJoined?')) {
					return false;
				}

				const searchParams = new URLSearchParams(url.substring(url.indexOf('?') + 1));
				return (
					searchParams.has('username') &&
					/^[A-Za-z0-9_]{2,16}$/g.test(searchParams.get('username')!) &&
					searchParams.has('serverId') &&
					searchParams.get('serverId')!.length > 0
				);
			},
			method: 'GET'
		},
		{
			urlMatch: '/blockedservers',
			method: 'GET'
		}
	],

	// api.minecraftservices.com
	services: [
		{
			urlMatch: '/publickeys',
			method: 'GET'
		},
		{
			urlMatch: '/privacy/blocklist',
			method: 'GET'
		},
		{
			urlMatch: '/player/attributes',
			method: 'GET'
		},
		{
			urlMatch: '/player/certificates',
			method: 'POST'
		},
		{
			urlMatch: '/minecraft/profile/lookup/bulk/byname',
			method: 'POST'
		}
	]
} satisfies Record<string, MSPValidatationCtx[]>;
