<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Field, Input, Select, Textarea } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import type { CouponQuote } from '$lib/api/types';

	let { data, form } = $props();

	/* Held here rather than read from `form` each time: placing the order is a
	   second post, and its result would otherwise wipe the applied code. */
	let applied = $state<CouponQuote | null>(null);
	let couponError = $state('');
	let code = $state('');
	/* The coupon action counts uses per customer, and the customer is the phone. */
	let phone = $state('');

	const value = (key: string) => (form?.values?.[key] as string) ?? '';
	const districtOptions = $derived(
		data.districts.map((d) => ({ value: d.code, label: `${d.name} — ${d.name_bn}` }))
	);

	let method = $state('cod');
	let district = $state('');
	let submitting = $state(false);

	/* What delivery costs, fetched the moment a district is picked.
	 *
	 * The page used to promise it would be "worked out and added to the total",
	 * which in a cash-on-delivery market is the wrong place to leave it: the
	 * charge can be a fifth of a small basket, and a shopper who first meets it
	 * at the door refuses the parcel — leaving the shop to pay the courier for
	 * a sale it never made.
	 *
	 * The API still prices the order authoritatively at submit. This is the
	 * shopper's answer, not the ledger's, so a failure is worn quietly. */
	let shipping = $state<number | null>(null);
	let quoting = $state(false);

	/* The discount lands before delivery, which is how the API totals it, so
	   the two agree and free-delivery-above thresholds mean what they say. */
	const payable = $derived(
		data.cart.subtotal_minor - (applied?.discount_minor ?? 0) + (shipping ?? 0)
	);

	$effect(() => {
		const code = district;
		if (!code) {
			shipping = null;
			return;
		}

		let cancelled = false;
		quoting = true;
		const params = new URLSearchParams({
			district_code: code,
			subtotal_minor: String(Math.max(data.cart.subtotal_minor - (applied?.discount_minor ?? 0), 0))
		});

		fetch(`/checkout/quote?${params}`)
			.then((r) => (r.ok ? r.json() : null))
			.then((quote) => {
				if (cancelled) return;
				shipping = typeof quote?.shipping_minor === 'number' ? quote.shipping_minor : null;
			})
			.catch(() => {
				if (!cancelled) shipping = null;
			})
			.finally(() => {
				if (!cancelled) quoting = false;
			});

		// A shopper changing their mind twice must not be shown the first answer.
		return () => {
			cancelled = true;
		};
	});
</script>

<Seo title="Checkout" description="Confirm your delivery details." noindex />

<div class="wrap container-page">
	<h1 class="t-heading">Checkout</h1>

	{#if form?.message}
		<Banner title={form.soldOut ? 'Someone got there first' : 'Check your details'} tone="danger">
			{form.message}
			{#if form.soldOut}
				<p class="fix">Go back to your basket and change the quantity, or remove that item.</p>
			{/if}
			{#snippet actions()}
				{#if form.soldOut}<Button href="/cart" variant="ghost">Back to basket</Button>{/if}
			{/snippet}
		</Banner>
	{/if}

	<div class="cols">
		<form
			method="POST"
			action="?/place"
			class="form"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<section>
				<h2 class="legend t-label">Who is receiving this</h2>
				<div class="pair">
					<Field label="Full name" required error={form?.fields?.recipient}>
						{#snippet control(props)}
							<Input {...props} name="recipient" value={value('recipient')} autocomplete="name" />
						{/snippet}
					</Field>
					<Field label="Mobile number" required error={form?.fields?.phone}>
						{#snippet control(props)}
							<Input
								{...props}
								name="phone"
								bind:value={phone}
								inputmode="tel"
								numeric
								placeholder="01712345678"
								autocomplete="tel"
							/>
						{/snippet}
					</Field>
				</div>
				<Field label="Email" hint="Optional. For the receipt." error={form?.fields?.email}>
					{#snippet control(props)}
						<Input
							{...props}
							name="email"
							type="email"
							value={value('email')}
							autocomplete="email"
						/>
					{/snippet}
				</Field>
			</section>

			<section>
				<h2 class="legend t-label">Where it goes</h2>
				<div class="pair">
					<Field label="District" required error={form?.fields?.district_code}>
						{#snippet control(props)}
							<Select
								{...props}
								name="district_code"
								options={districtOptions}
								placeholder="Choose a district"
								bind:value={district}
							/>
						{/snippet}
					</Field>
					<Field label="Thana or upazila" required error={form?.fields?.thana}>
						{#snippet control(props)}
							<Input {...props} name="thana" value={value('thana')} />
						{/snippet}
					</Field>
				</div>
				<Field
					label="Address"
					required
					hint="House, road and any landmark."
					error={form?.fields?.street}
				>
					{#snippet control(props)}
						<Input {...props} name="street" value={value('street')} autocomplete="street-address" />
					{/snippet}
				</Field>
				<div class="pair">
					<Field label="Area" error={form?.fields?.area}>
						{#snippet control(props)}
							<Input {...props} name="area" value={value('area')} />
						{/snippet}
					</Field>
					<Field label="Postcode" error={form?.fields?.postcode}>
						{#snippet control(props)}
							<Input
								{...props}
								name="postcode"
								value={value('postcode')}
								numeric
								inputmode="numeric"
							/>
						{/snippet}
					</Field>
				</div>
			</section>

			<section>
				<h2 class="legend t-label">How you pay</h2>
				<div class="methods">
					{#each data.methods as option (option.provider)}
						<label class="method" class:is-picked={method === option.provider}>
							<input
								type="radio"
								name="payment_method"
								value={option.provider}
								bind:group={method}
							/>
							<span class="method-name">{option.display_name}</span>
							{#if option.provider === 'cod'}
								<span class="method-note t-label">Pay the courier at your door</span>
							{/if}
						</label>
					{/each}
				</div>
				{#if form?.fields?.payment_method}
					<p class="err">{form.fields.payment_method}</p>
				{/if}
			</section>

			<Field label="Banner for the shop" hint="Optional.">
				{#snippet control(props)}
					<Textarea {...props} name="note" rows={3} value={value('note')} />
				{/snippet}
			</Field>

			<!-- The code the shopper applied, carried into the order that uses it. -->
			<input type="hidden" name="coupon_code" value={applied?.code ?? ''} />

			<Button type="submit" arrow loading={submitting}>Place the order</Button>
		</form>

		<aside class="side">
			<h2 class="legend t-label">Your order</h2>
			<div class="lines">
				{#each data.cart.lines as line (line.variant_id)}
					<div class="line">
						<span class="line-title">
							{line.title}
							<span class="qty t-mono">× {line.quantity}</span>
						</span>
						<span class="line-total t-mono">
							{formatMinor(line.line_total_minor, data.cart.currency)}
						</span>
					</div>
				{/each}
			</div>
			<div class="line total">
				<span>Subtotal</span>
				<span class="t-mono">{formatMinor(data.cart.subtotal_minor, data.cart.currency)}</span>
			</div>

			{#if applied}
				<div class="line off">
					<span>{applied.code}</span>
					<span class="t-mono">−{formatMinor(applied.discount_minor, data.cart.currency)}</span>
				</div>
			{/if}

			<!-- Its own form: applying a code prices the basket, it does not place
			     the order. The accepted code rides along in a hidden field below. -->
			<form
				method="POST"
				action="?/coupon"
				class="code"
				use:enhance={() =>
					async ({ result }) => {
						if (result.type === 'success') {
							applied = (result.data as { coupon: CouponQuote }).coupon;
							couponError = '';
						} else if (result.type === 'failure') {
							applied = null;
							couponError = (result.data as { couponError?: string })?.couponError ?? '';
						}
					}}
			>
				<input type="hidden" name="phone" value={phone} />
				<Input
					name="coupon_code"
					bind:value={code}
					placeholder="Discount code"
					aria-label="Discount code"
				/>
				<Button type="submit" variant="quiet">Apply</Button>
			</form>
			{#if couponError}
				<p class="code-error t-label" aria-live="polite">{couponError}</p>
			{/if}
			<div class="line">
				<span>Delivery</span>
				<span class="t-mono" aria-live="polite">
					{#if !district}
						<span class="pending">Choose a district</span>
					{:else if quoting}
						<span class="pending">Working it out…</span>
					{:else if shipping === null}
						<span class="pending">Added at the end</span>
					{:else if shipping === 0}
						Free
					{:else}
						{formatMinor(shipping, data.cart.currency)}
					{/if}
				</span>
			</div>

			<div class="line total payable">
				<span>{method === 'cod' ? 'To pay on delivery' : 'To pay'}</span>
				<span class="t-mono">{formatMinor(payable, data.cart.currency)}</span>
			</div>

			{#if shipping === null && district}
				<p class="delivery t-label">
					We could not work out delivery just now. It is added when your order is placed.
				</p>
			{/if}
		</aside>
	</div>
</div>

<style>
	.code {
		display: flex;
		gap: 8px;
		margin-top: 14px;
	}

	.off {
		color: var(--accent);
	}

	.code-error {
		margin-top: 6px;
		color: var(--muted);
	}

	.pending {
		color: var(--muted);
	}

	/* The number the shopper actually hands over. It carries the weight on this
	   panel, because on a cash order it is the only figure that matters. */
	.payable {
		font-weight: 600;
	}

	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.cols {
		display: grid;
		gap: 48px;
		align-items: start;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.form section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.legend {
		color: var(--faint);
		padding-bottom: 14px;
		border-bottom: 1px solid var(--rule);
	}

	.pair {
		display: grid;
		gap: 20px;
	}

	.methods {
		border-top: 1px solid var(--rule);
	}

	.method {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-block: 16px;
		border-bottom: 1px solid var(--rule);
		cursor: pointer;
	}

	/* A radio, so it is round — the shape is how a person knows only one of
	   these can be picked. */
	.method input {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		appearance: none;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-round);
		background: var(--paper);
	}

	.method input:checked {
		border-color: var(--ink);
		border-width: 5px;
	}

	.method-name {
		font-size: 15px;
		flex: 1;
	}

	.is-picked .method-name {
		font-weight: 600;
	}

	.method-note {
		color: var(--faint);
	}

	.err {
		font-size: 13px;
		font-weight: 600;
		padding-left: 10px;
		border-left: 2px solid var(--ink);
	}

	.fix {
		margin-top: 8px;
	}

	.side {
		background: var(--surface);
		border-radius: var(--r-card);
		padding: 24px;
	}

	.side .legend {
		border-bottom-color: var(--rule-strong);
	}

	.lines {
		margin-top: 18px;
	}

	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
		font-size: 14px;
	}

	.line-title {
		color: var(--muted);
	}

	.qty {
		color: var(--faint);
		font-size: 12px;
	}

	.line-total {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		white-space: nowrap;
	}

	.total {
		border-bottom: none;
		padding-top: 16px;
		font-size: 16px;
		font-weight: 600;
	}

	.total span:last-child {
		font-size: 20px;
		font-variant-numeric: tabular-nums;
	}

	.delivery {
		margin-top: 12px;
		color: var(--faint);
		line-height: 1.6;
	}

	@media (min-width: 620px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 960px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) 340px;
			gap: 64px;
		}

		.side {
			position: sticky;
			top: 92px;
		}
	}
</style>
