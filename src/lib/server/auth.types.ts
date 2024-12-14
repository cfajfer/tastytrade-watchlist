export interface TastytradeGenericResponse<Error, T> {
	status: number;
	error: Error;
	data: T;
}

export interface TastytradeErrorResponse {
	response: {
		status: number;
		data: {
			error: {
				code?: string;
				message: string;
			};
		};
	};
}

export interface TastytradePostSessionResponse {
	user: {
		email: string;
		username: string;
		'external-id': string;
	};
	'session-token': string;
	'session-expiration': string; // Date
	'remember-token'?: string;
}

export type loginResponse =
	| TastytradeGenericResponse<true, TastytradeErrorResponse['response']['data']['error']> // Error
	| TastytradeGenericResponse<false, TastytradePostSessionResponse>; // Success

export interface TastytradePostSessionValidateResponse {
	email: string;
	'external-id': string;
	'is-confirmed': boolean;
	username: string;
	id: number;
}

export type validateSessionResponse = {
	session: TastytradePostSessionValidateResponse['is-confirmed'] | null;
	user: TastytradePostSessionValidateResponse['username'] | null;
};
