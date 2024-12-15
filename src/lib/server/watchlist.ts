import type { TastytradeErrorResponse } from './server.types';
import { tastytradeApi } from './tastytradeClient';
import type {
	createWatchlistResponse,
	getAllWatchlistsResponse,
	getWatchlistResponse,
	TastytradeCreateWatchlistResponse,
	TastytradeGetAllWatchlistResponse,
	TastytradeGetWatchlistResponse
} from './watchlist.types';

export const getAllWatchlists = async (): Promise<getAllWatchlistsResponse> => {
	try {
		const res =
			(await tastytradeApi.watchlistsService.getAllWatchlists()) as TastytradeGetAllWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};

export const createWatchlist = async (watchlistName: string): Promise<createWatchlistResponse> => {
	try {
		const res = (await tastytradeApi.watchlistsService.createAccountWatchlist({
			name: watchlistName,
			'watchlist-entries': [] // this is empty until we add some symbols
		})) as TastytradeCreateWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};

export const deleteWatchlist = async (watchlistName: string): Promise<getWatchlistResponse> => {
	try {
		const res = (await tastytradeApi.watchlistsService.deleteWatchlist(
			watchlistName
		)) as TastytradeGetWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};

export const getWatchlist = async (watchlistName: string): Promise<getWatchlistResponse> => {
	try {
		const res = (await tastytradeApi.watchlistsService.getSingleWatchlist(
			watchlistName
		)) as TastytradeGetWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};

export const addSymbolToWatchlist = async (
	watchlistName: string,
	watchlistSymbols: string[],
	newSymbol: string
): Promise<getWatchlistResponse> => {
	try {
		const res = (await tastytradeApi.watchlistsService.replaceWatchlist(watchlistName, {
			name: watchlistName,
			'watchlist-entries': [
				...watchlistSymbols.map((symbol) => ({ symbol: symbol })),
				{ symbol: newSymbol }
			]
		})) as TastytradeGetWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};

export const removeSymbolFromWatchlist = async (
	watchlistName: string,
	watchlistSymbols: string[],
	symbolToDelete: string
): Promise<getWatchlistResponse> => {
	try {
		const res = (await tastytradeApi.watchlistsService.replaceWatchlist(watchlistName, {
			name: watchlistName,
			'watchlist-entries': [
				...watchlistSymbols
					.filter((symbol) => symbol !== symbolToDelete)
					.map((symbol) => ({ symbol: symbol }))
			]
		})) as TastytradeGetWatchlistResponse;

		return {
			status: 200,
			error: false,
			data: res
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
			return {
				status: errorResponse.response.status,
				error: true,
				data: errorResponse.response.data.error
			};
		}
	}

	return {
		status: 500,
		error: true,
		data: {
			message: 'Internal Server Error'
		}
	};
};
