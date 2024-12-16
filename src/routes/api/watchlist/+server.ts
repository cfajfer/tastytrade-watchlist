import * as watchlist from '$lib/server/watchlist';
import type { RequestEvent } from './$types';
import type { getWatchlistResponse } from '$lib/server/watchlist.types';

export const GET = async ({ url }: RequestEvent): Promise<Response> => {
	const watchlistName = url.searchParams.get('query')?.trim();
	if (!watchlistName) {
		return new Response(JSON.stringify({ error: 'Missing watchlist name in query' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const res: getWatchlistResponse = await watchlist.getWatchlist(watchlistName);

	return new Response(JSON.stringify(res.data), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST = async ({ request }: RequestEvent): Promise<Response> => {
	try {
		const body = await request.json();
		const { watchlistName, watchlistSymbols, newSymbol } = body;

		if (!watchlistName || !newSymbol || !Array.isArray(watchlistSymbols)) {
			return new Response(
				JSON.stringify({ error: 'Invalid request body: Missing required fields' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		await watchlist.addSymbolToWatchlist(watchlistName, watchlistSymbols, newSymbol);

		return new Response(null, { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to add symbol to watchlist', details: error }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};

export const DELETE = async ({ request, url }: RequestEvent): Promise<Response> => {
	try {
		const watchlistName = url.searchParams.get('query')?.trim();
		if (!watchlistName) {
			return new Response(JSON.stringify({ error: 'Missing watchlist name in query' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const body = await request.json();
		const { watchlistSymbols, symbolToDelete } = body;

		// If watchlistSymbols is not an array or symbolToDelete is not provided, delete the entire watchlist
		if (!Array.isArray(watchlistSymbols) || !symbolToDelete) {
			await watchlist.deleteWatchlist(watchlistName);
		}

		// Otherwise, remove the symbol from the watchlist
		await watchlist.removeSymbolFromWatchlist(watchlistName, watchlistSymbols, symbolToDelete);

		return new Response(null, { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to remove symbol from watchlist', details: error }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
