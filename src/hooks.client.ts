import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = ({ status }) => ({
	message: 'Something went wrong.',
	code: `CLIENT_${status}`
});
