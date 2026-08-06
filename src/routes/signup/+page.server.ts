import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { storefrontUrl } from '$lib/server/shop';
import { fieldErrors, toUserMessage } from '$lib/api/errors';
import type { Industry, SignupResult, ThemeSummary } from '$lib/api/types';

const PhoneSchema = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Enter your mobile number.'),
	v.regex(/^(\+?88)?01[3-9]\d{8}$/, 'Enter a Bangladeshi mobile number, like 01712345678.')
);

const StartSchema = v.object({ phone: PhoneSchema });

const CompleteSchema = v.object({
	shop_name: v.pipe(v.string(), v.trim(), v.nonEmpty("Enter your shop's name.")),
	slug: v.pipe(v.string(), v.trim()),
	industry: v.pipe(v.string(), v.trim(), v.nonEmpty('Choose what you sell.')),
	/* The chosen design. Not required here: the server checks the pair against
	   the catalogue and falls back to the trade's default, so a shop is never
	   refused over a design. */
	theme_code: v.pipe(v.string(), v.trim()),
	preset_code: v.pipe(v.string(), v.trim()),
	owner_name: v.pipe(v.string(), v.trim()),
	phone: PhoneSchema,
	code: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter the code we sent you.'),
		v.regex(/^\d{4,8}$/, 'The code is the digits we sent by text.')
	)
});

interface Outcome {
	step: 'start' | 'complete';
	sent: boolean;
	message: string;
	fields: Record<string, string>;
	shop: SignupResult | null;
}

/* Every outcome carries the same keys, so the page reads one shape rather than
   narrowing a union on every reference. */
function outcome(step: Outcome['step'], part: Partial<Outcome> = {}): Outcome {
	return { step, sent: false, message: '', fields: {}, shop: null, ...part };
}

function issuesToFields(issues: v.BaseIssue<unknown>[]): Record<string, string> {
	return Object.fromEntries(
		issues.map((issue) => [String(issue.path?.[0]?.key ?? ''), issue.message])
	);
}

export const load: PageServerLoad = async ({ fetch }) => {
	const [industries, themes] = await Promise.all([
		get<{ industries: Industry[] }>(fetch, '/v1/signup/industries'),
		get<{ themes: ThemeSummary[] }>(fetch, '/v1/signup/themes')
	]);

	return {
		industries: industries.industries ?? [],
		themes: themes.themes ?? []
	};
};

export const actions: Actions = {
	// Sending the code is its own step so a wrong number costs one message, not
	// a whole form.
	start: async ({ request, fetch }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '');

		const parsed = v.safeParse(StartSchema, { phone });
		if (!parsed.success)
			return fail(422, outcome('start', { fields: issuesToFields(parsed.issues) }));

		try {
			await call(fetch, '/v1/signup/start', { method: 'POST', body: parsed.output });
		} catch (cause) {
			return fail(429, {
				...outcome('start', { fields: fieldErrors(cause), message: toUserMessage(cause) })
			});
		}
		return outcome('start', { sent: true });
	},

	complete: async ({ request, fetch, url }) => {
		const form = await request.formData();
		const values = Object.fromEntries(
			[
				'shop_name',
				'slug',
				'industry',
				'theme_code',
				'preset_code',
				'owner_name',
				'phone',
				'code'
			].map((key) => [key, String(form.get(key) ?? '')])
		);

		const parsed = v.safeParse(CompleteSchema, values);
		if (!parsed.success)
			return fail(422, outcome('complete', { fields: issuesToFields(parsed.issues) }));

		try {
			const reply = await call<SignupResult>(fetch, '/v1/signup/complete', {
				method: 'POST',
				body: parsed.output
			});
			const storefront = storefrontUrl(reply.data.slug, url);

			// The code is spent either way, so the number stays verified for the
			// next attempt if anything downstream fails.
			return outcome('complete', { sent: true, shop: { ...reply.data, storefront } });
		} catch (cause) {
			return fail(422, {
				...outcome('complete', {
					sent: true,
					fields: fieldErrors(cause),
					message: toUserMessage(cause)
				})
			});
		}
	}
};
