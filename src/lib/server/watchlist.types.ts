import type { TastytradeGenericResponse, TastytradeErrorResponse } from './server.types';

export interface WatchlistEntry {
	name: string;
	'order-index': number;
}

export interface WatchlistEntryWithSymbols extends WatchlistEntry {
	'watchlist-entries'?: { symbol: string }[];
}

export type TastytradeGetAllWatchlistResponse = WatchlistEntryWithSymbols[];

export type TastytradeCreateWatchlistResponse = WatchlistEntry[];

export type TastytradeGetWatchlistResponse = WatchlistEntryWithSymbols;

export type createWatchlistResponse =
	| TastytradeGenericResponse<true, TastytradeErrorResponse['response']['data']['error']> // Error
	| TastytradeGenericResponse<false, TastytradeCreateWatchlistResponse>; // Success

export type getAllWatchlistsResponse =
	| TastytradeGenericResponse<true, TastytradeErrorResponse['response']['data']['error']> // Error
	| TastytradeGenericResponse<false, TastytradeGetAllWatchlistResponse>; // Success

export type getWatchlistResponse =
	| TastytradeGenericResponse<true, TastytradeErrorResponse['response']['data']['error']> // Error
	| TastytradeGenericResponse<false, TastytradeGetWatchlistResponse>; // Success
