import { PUBLIC_API_URL } from '$env/static/public';
import type { Availability } from '$lib/api/types';

/* Is this address free?
 *
 * The address is the server's answer, not ours: `slug.Make` keeps Bangla, so a
 * shop called রহিম স্টোর gets রহিম-স্টোর and not an empty string. Guessing the
 * rule on the client would be a second implementation that has to agree with
 * the first one forever.
 *
 * Every reply is checked against the last thing asked before it is kept, so a
 * slow answer for an old name cannot overwrite a fast answer for the current
 * one.
 */
export class AddressCheck {
	found = $state<Availability | null>(null);
	checking = $state(false);
	failed = $state('');

	#timer = 0;
	#lastAsked = '';

	/** Waits for a pause in typing — one request per name, not one per keystroke. */
	check(value: string) {
		clearTimeout(this.#timer);
		this.#timer = window.setTimeout(() => this.#ask(value), 550);
	}

	#ask(value: string) {
		const trimmed = value.trim();
		if (trimmed.length < 2) {
			this.found = null;
			this.checking = false;
			return;
		}
		if (trimmed === this.#lastAsked) return;
		this.#lastAsked = trimmed;
		this.checking = true;
		this.failed = '';

		// Straight to the API rather than through our server: the check is rate
		// limited per address, and one shared server address is one bucket for
		// everyone.
		fetch(`${PUBLIC_API_URL.replace(/\/$/, '')}/v1/signup/check-address`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug: trimmed })
		})
			.then(async (response) => {
				const payload = await response.json();
				if (!response.ok) throw new Error(payload?.error?.message ?? '');
				if (this.#lastAsked === trimmed) this.found = payload as Availability;
			})
			.catch((cause: Error) => {
				if (this.#lastAsked !== trimmed) return;
				this.found = null;
				this.failed = cause.message || 'We could not check that address. Try again in a moment.';
			})
			.finally(() => {
				if (this.#lastAsked === trimmed) this.checking = false;
			});
	}
}
