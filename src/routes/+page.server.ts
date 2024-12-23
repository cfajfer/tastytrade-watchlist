import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as watchlist from '$lib/server/watchlist';
import { getDXFeedToken } from '$lib/server/dxLinkClient';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const sessionToken = event.cookies.get(auth.sessionTokenCookieName) as string;

	const token = await getDXFeedToken(sessionToken);

	const watchlists = await watchlist.getAllWatchlists();
	const user: string = event.locals.user ?? '';

	if (watchlists.error) {
		return { user, watchlists: [], token };
	}

	return { user, watchlists: watchlists.data, token };
};

export const actions: Actions = {
	logout: async (event) => {
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},
	addWatchlist: async (event) => {
		const formData = await event.request.formData();
		const watchlistName = formData.get('name') as string;

		await watchlist.createWatchlist(watchlistName);
	},
	deleteWatchlist: async (event) => {
		const formData = await event.request.formData();
		const watchlistName = formData.get('name') as string;

		await watchlist.deleteWatchlist(watchlistName);
	}
};
