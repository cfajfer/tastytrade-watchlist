import * as symbolSearch from '$lib/server/symbolSearch';
import type { RequestEvent } from './$types';
import type { getSymbolSearchResponse } from '$lib/server/symbolSearch.types';

export const GET = async ({ url }: RequestEvent): Promise<Response> => {
	try {
		const symbol = url.searchParams.get('query')?.trim();
		if (!symbol) {
			return new Response(JSON.stringify({ error: 'Query parameter "query" is required.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const res: getSymbolSearchResponse = await symbolSearch.getSymbolSearch(symbol);

		if (res.error) {
			return new Response(JSON.stringify(res.data), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify(res.data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error fetching symbol data:', error);

		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
