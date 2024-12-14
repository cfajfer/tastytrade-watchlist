import type { RequestEvent } from '@sveltejs/kit';
import { tastytradeApi } from './tastytradeClient';
import type {
	loginResponse,
	TastytradeErrorResponse,
	TastytradePostSessionResponse,
	validateSessionResponse
} from './auth.types.ts';

export const sessionTokenCookieName = 'auth-session';
export const sessionRememberCookieName = 'auth-remember';

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

export const setSessionTokenCookie = (event: RequestEvent, sessionToken: string) => {
	event.cookies.set(sessionTokenCookieName, sessionToken, {
		path: '/'
	});
};

export const deleteSessionTokenCookie = (event: RequestEvent) => {
	event.cookies.delete(sessionTokenCookieName, {
		path: '/'
	});
};

export const setRememberTokenCookie = (event: RequestEvent, rememberToken: string) => {
	event.cookies.set(sessionRememberCookieName, rememberToken, {
		path: '/'
	});
};

export const deleteRememberTokenCookie = (event: RequestEvent) => {
	event.cookies.delete('remember-token', {
		path: '/'
	});
};
