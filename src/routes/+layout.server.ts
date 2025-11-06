import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session, user, userProfile } }) => {
	return {
		session,
		user,
		userProfile
	};
};
