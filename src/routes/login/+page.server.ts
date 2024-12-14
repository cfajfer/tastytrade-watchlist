import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const loginRes = await auth.login(username, password);

		// if there was an error, show the error message
		if (loginRes.error) {
			return fail(loginRes.status, { message: loginRes.data.message });
		}

		// otherwise, set the session token cookie and redirect to the homepage
		auth.setSessionTokenCookie(event, loginRes.data['session-token']);
		return redirect(302, '/');
	}
};

const validateUsername = (username: unknown): username is string => {
	return typeof username === 'string' && username.length > 0 && username.length < 256;
};

const validatePassword = (password: unknown): password is string => {
	return typeof password === 'string' && password.length > 0 && password.length < 256;
};
