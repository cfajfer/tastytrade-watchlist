import { tastytradeApi } from './tastytradeClient';
import type {
	loginResponse,
	TastytradeErrorResponse,
	TastytradePostSessionResponse,
	validateSessionResponse
} from './auth.types.ts';

export const login = async (username: string, password: string): Promise<loginResponse> => {
	try {
		const res = (await tastytradeApi.sessionService.login(
			username,
			password
		)) as TastytradePostSessionResponse;
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

export const validateSession = async (): Promise<validateSessionResponse> => {
	try {
		const res = await tastytradeApi.sessionService.validate();
		return {
			session: res['is-confirmed'],
			user: res.username
		};
	} catch (error: unknown) {
		const errorResponse = error as TastytradeErrorResponse;
		if (errorResponse.response) {
			console.error('Error:', errorResponse.response.data.error.message);
		}
		return {
			session: null,
			user: null
		};
	}
};
