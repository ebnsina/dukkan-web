import { fail } from '@sveltejs/kit';
import { fieldErrors, isApiError, toUserMessage } from '$lib/api/errors';

/* Turning a failed API call into a failed form.
 *
 * Every action did this the same way and by hand: carry the API's status if it
 * gave one, its field errors onto the fields, and its message to the top. The
 * one that gets it wrong is the one that leaks a status of 500 for a 422, so it
 * is written once.
 *
 * Client-side validation still calls `fail` directly — nothing failed there, so
 * there is no cause to read.
 */
export function failedCall<T extends Record<string, unknown>>(cause: unknown, extra?: T) {
	return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
		...(extra ?? ({} as T)),
		fields: fieldErrors(cause),
		message: toUserMessage(cause)
	});
}
