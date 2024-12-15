// import { tastytradeApi } from './tastytradeClient';

import type { TastytradeErrorResponse } from './server.types';
import type { getSymbolSearchResponse, TastytradeSearchSymbolResponse } from './symbolSearch.types';

export const getSymbolSearch = async (symbol: string): Promise<getSymbolSearchResponse> => {
	try {
		// ! This returns a 503 Service Unavailable error
		// const res = (await tastytradeApi.symbolSearchService.getSymbolData(symbol)) as any;

		const res = (await fetch('https://vast.tastyworks.com/symbols/search/' + symbol, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json())) as TastytradeSearchSymbolResponse;

		// return the first 5 symbol objects
		const data = res?.data?.items.slice(0, 5) || [];

		return {
			status: 200,
			error: false,
			data
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error?.message);
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
