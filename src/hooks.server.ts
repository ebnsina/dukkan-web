import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ status }) => ({
	message: 'Something went wrong.',
	code: `SERVER_${status}`
});
