import type { TastytradeGenericResponse, TastytradeErrorResponse } from './server.types';

export interface SymbolObject {
	symbol: string;
	description: string;
	'instrument-type': string;
}

export interface TastytradeSearchSymbolResponse {
	data: {
		items: SymbolObject[] | [];
	};
}

export type getSymbolSearchResponse =
	| TastytradeGenericResponse<true, TastytradeErrorResponse['response']['data']['error']> // Error
	| TastytradeGenericResponse<false, TastytradeSearchSymbolResponse['data']['items']>; // Success
