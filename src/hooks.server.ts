import type { Handle } from '@sveltejs/kit';
import { user_manager } from '$lib/database';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	if (session != null) {
		const get_result = await user_manager.get_by_session(session).resolve();
		if (get_result.ok) {
			event.locals.user = get_result.val;
		}
	}

	const response = await resolve(event);
	return response;
};
