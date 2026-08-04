<script lang="ts">
	/* The component library, once.
	 *
	 * There is one specimen of each component, not one per surface: a component
	 * reads the standard token names and the surface it sits in rebinds them, so
	 * three copies of the same markup showed the same design three times. What a
	 * surface changes is the palette, and the theme toggle already demonstrates
	 * that on this page. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Delete02Icon,
		PlusSignIcon,
		Search01Icon,
		MoreHorizontalIcon,
		InformationCircleIcon
	} from '@hugeicons/core-free-icons';
	import {
		Accordion,
		Avatar,
		Banner,
		Breadcrumb,
		Button,
		Checkbox,
		Chip,
		Confirm,
		Dialog,
		Divider,
		Drawer,
		Empty,
		Field,
		Frame,
		HoverCard,
		Input,
		Menu,
		Pagination,
		PageHeader,
		Progress,
		Pulse,
		Radio,
		Select,
		Skeleton,
		Spinner,
		Stat,
		Status,
		Table,
		Tabs,
		Textarea,
		Toggle,
		Tooltip,
		toasts,
		type Tone
	} from '$lib/ui';

	const tones: Tone[] = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

	const couriers = [
		{ value: 'pathao', label: 'Pathao' },
		{ value: 'steadfast', label: 'Steadfast' },
		{ value: 'redx', label: 'RedX', disabled: true }
	];

	const faq = [
		{ value: 'fees', label: 'What does Dukkàn cost?', meta: 'Per order, nothing monthly' },
		{ value: 'cod', label: 'How does cash on delivery settle?' },
		{ value: 'courier', label: 'Which couriers can I book?' }
	];

	const answers: Record<string, string> = {
		fees: 'A flat cut of each order that goes through. No monthly charge, and nothing to pay in a month you sell nothing.',
		cod: 'The courier collects the cash and pays it into your bank account. The reconciliation queue shows what is still out with a rider.',
		courier: 'Pathao and Steadfast today, from the order page. RedX is next.'
	};

	let toggled = $state(true);
	let agreed = $state(false);
	let partial = $state(true);
	let payment = $state('bkash');
	let courier = $state('pathao');
	let tab = $state('orders');
	let page = $state(3);
	let openAccordion = $state(['fees']);

	let submitting = $state(false);
	let submitted = $state(false);

	// What a real submit does: the button takes the wait, one toast covers the
	// round trip, and the answer lands in the toast the merchant is reading.
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		const id = toasts.push({ title: 'Booking a courier', loading: true });
		await new Promise((resolve) => setTimeout(resolve, 1400));
		submitting = false;
		submitted = true;
		toasts.update(id, {
			title: 'Courier booked',
			description: 'Pathao collects DK-1005 before six.',
			tone: 'success',
			action: { label: 'Undo', onclick: () => (submitted = false) }
		});
	}

	let dialogOpen = $state(false);
	let confirmOpen = $state(false);
	let drawerOpen = $state(false);
</script>

<div class="library container-page">
	<header class="masthead">
		<span class="eyebrow">05 / Components</span>
		<h2 class="lede">One library. Build from it.</h2>
		<p class="dek">
			Every control the storefront, the admin and the landing page use. Nothing is forked per
			surface: a component reads the standard token names — <code>--paper</code>,
			<code>--ink</code>, <code>--accent</code> — and each surface rebinds those to its own values.
			Where one place needs something different it passes <code>class</code> at the call site,
			which every component merges last.
		</p>
		<p class="dek">
			Motion, the focus ring and the keyboard are the component's job, not the call site's — so a
			control arrives correct rather than needing to be made correct.
		</p>
	</header>

	<!-- ── Buttons ─────────────────────────────────────────────────────── -->
	<section id="buttons" class="group">
		<h2>Buttons</h2>
		<div class="cases">
			<div class="case">
				<span class="case-label">Variants</span>
				<div class="row">
					<Button>Solid</Button>
					<Button variant="quiet">Quiet</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger" icon={Delete02Icon}>Danger</Button>
					<Button variant="link" href="#top">Link</Button>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Sizes</span>
				<div class="row is-baseline">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
			</div>

			<div class="case">
				<span class="case-label">States</span>
				<div class="row">
					<Button icon={PlusSignIcon}>With icon</Button>
					<Button variant="quiet" arrow>With arrow</Button>
					<Button loading>Saving</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Full width · link</span>
				<div class="stack">
					<Button full>Place the order</Button>
					<Button href="#top" variant="quiet" full arrow>Rendered as a link</Button>
					<Button variant="link" arrow>Read the payout rules</Button>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Forms ───────────────────────────────────────────────────────── -->
	<section id="forms" class="group">
		<h2>Forms</h2>
		<div class="cases">
			<div class="case">
				<span class="case-label">Field, hint and error</span>
				<div class="stack">
					<Field label="Mobile number" required hint="We text a code to this number.">
						{#snippet control(props)}
							<Input {...props} name="phone" placeholder="01712345678" />
						{/snippet}
					</Field>
					<Field label="Store ID" error="We could not read that.">
						{#snippet control(props)}
							<Input {...props} name="store" value="bad-value" />
						{/snippet}
					</Field>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Input, Select, Textarea</span>
				<div class="stack">
					<Input placeholder="Search orders" />
					<Input numeric value="1,250" aria-label="Price" />
					<Input value="Locked" disabled aria-label="Disabled" />
					<Select
						options={couriers}
						bind:value={courier}
						placeholder="Pick a courier"
						aria-label="Courier"
					/>
					<Textarea placeholder="A note for the rider" rows={3} />
				</div>
			</div>

			<div class="case">
				<span class="case-label">Checkbox and Radio</span>
				<div class="stack">
					<Checkbox bind:checked={agreed} label="Send an SMS when it ships" />
					<Checkbox bind:indeterminate={partial} label="Some items selected" />
					<Checkbox checked disabled label="Cannot be changed" />
					<Divider />
					<!-- Radios are a single choice, so they are one named group,
					     not two controls that happen to sit together. -->
					<fieldset class="group-set">
						<legend class="t-label">How they pay</legend>
						<Radio
							bind:group={payment}
							name="payment"
							value="bkash"
							label="bKash"
							description="Paid before the parcel leaves."
						/>
						<Radio bind:group={payment} name="payment" value="cod" label="Cash on delivery" />
					</fieldset>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Toggle</span>
				<div class="stack">
					<Toggle bind:checked={toggled} label="Take cash on delivery" description="Most orders." />
					<Toggle checked={false} disabled label="Turned off" />
				</div>
			</div>
		</div>
	</section>

	<!-- ── Feedback ────────────────────────────────────────────────────── -->
	<section id="feedback" class="group">
		<h2>Feedback</h2>
		<div class="cases">
			<div class="case">
				<span class="case-label">Banner</span>
				<div class="stack">
					<Banner title="Money is missing" tone="danger">
						Two parcels need chasing with a courier.
					</Banner>
					<Banner title="Saved" tone="success">Your payment details are in.</Banner>
					<Banner tone="info" dismissible>Prices now include VAT.</Banner>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Chip and Status</span>
				<div class="stack">
					<div class="row">
						{#each tones as tone (tone)}
							<Chip {tone} label={tone} />
						{/each}
					</div>
					<div class="row">
						<Status status="placed" />
						<Status status="delivered" />
						<Status status="returned" />
						<Status status="pending" kind="payment" />
					</div>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Progress</span>
				<div class="stack">
					<Progress label="Stock sold" value={72} />
					<Progress label="Payout window" value={3} max={7} valueLabel="3 of 7 days" tone="warning" />
					<Progress label="Delivered on time" value={94} tone="success" />
				</div>
			</div>

			<div class="case is-wide">
				<span class="case-label">Toast tones, an action, and work in flight</span>
				<div class="row">
					<Button
						variant="quiet"
						size="sm"
						onclick={() => toasts.push({ title: 'Order sent', description: 'DK-1005 is with Pathao.' })}
					>
						Neutral
					</Button>
					<Button
						variant="quiet"
						size="sm"
						onclick={() => toasts.success('Payment received', { description: '৳6,100.00 from Karim.' })}
					>
						Success
					</Button>
					<Button
						variant="quiet"
						size="sm"
						onclick={() =>
							toasts.push({ title: 'Stock is low', description: 'Two shirts left.', tone: 'warning' })}
					>
						Warning
					</Button>
					<Button
						variant="quiet"
						size="sm"
						onclick={() =>
							toasts.error('Could not reach the courier', {
								description: 'Nothing was sent. Try again.',
								action: { label: 'Retry', onclick: () => toasts.success('Booked on the second try') }
							})}
					>
						Danger, with an action
					</Button>
				</div>

				<!-- A submit is the one interaction that has to say three things:
				     that it heard the click, that it is working, and how it went. -->
				<form class="submit-row" onsubmit={submit}>
					<Field label="Courier">
						{#snippet control(props)}
							<Select {...props} options={couriers} bind:value={courier} />
						{/snippet}
					</Field>
					<Button type="submit" loading={submitting}>
						{submitting ? 'Booking' : submitted ? 'Booked' : 'Book the courier'}
					</Button>
				</form>
			</div>

			<div class="case">
				<span class="case-label">Spinner, Skeleton, Pulse</span>
				<div class="stack">
					<div class="row is-baseline">
						<Spinner />
						<span class="inline"><Pulse /> Live</span>
					</div>
					<div class="stack is-tight">
						<Skeleton class="w-1/2" />
						<Skeleton />
						<Skeleton class="w-3/4" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Overlays ────────────────────────────────────────────────────── -->
	<section id="overlays" class="group">
		<h2>Overlays</h2>
		<p class="note">
			A modal renders in the top layer, outside every surface wrapper, so it reads the ramp
			directly rather than a rebound name.
		</p>
		<div class="cases">
			<div class="case">
				<span class="case-label">Dialog, Confirm, Drawer</span>
				<div class="row">
					<Button variant="quiet" size="sm" onclick={() => (dialogOpen = true)}>Dialog</Button>
					<Button variant="quiet" size="sm" onclick={() => (confirmOpen = true)}>Confirm</Button>
					<Button variant="quiet" size="sm" onclick={() => (drawerOpen = true)}>Drawer</Button>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Menu and Tooltip</span>
				<div class="row is-baseline">
					<Menu
						align="start"
						label="Order actions"
						items={[
							{ label: 'Print the label', onselect: () => {} },
							{ label: 'Book a courier', onselect: () => {} },
							{ label: 'Cancel the order', separatorBefore: true, onselect: () => {} },
							{ label: 'Refund', disabled: true }
						]}
					>
						{#snippet trigger()}
							<span class="icon-btn">
								<HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={1.8} />
							</span>
						{/snippet}
					</Menu>

					<Tooltip text="Only orders paid before dispatch count here.">
						<span class="inline">
							Paid up front
							<HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} />
						</span>
					</Tooltip>
				</div>
			</div>

			<div class="case">
				<span class="case-label">Hover card</span>
				<p class="prose">
					Point at
					<HoverCard>
						{#snippet trigger()}
							<button type="button" class="hc-link">
								<span class="hc-name">Karim</span>
							</button>
						{/snippet}
						<div class="who">
							<Avatar name="Karim Hossain" />
							<div>
								<p class="who-name">Karim Hossain</p>
								<p class="who-meta">Dhaka · 14 orders · ৳48,200 lifetime</p>
							</div>
						</div>
						<Divider />
						<p class="who-note">Last order DK-1005, cash on delivery, still with a rider.</p>
					</HoverCard>
					to see who they are without leaving the list. A tooltip holds a sentence; this holds a
					record.
				</p>
			</div>
		</div>
	</section>

	<!-- ── Navigation ──────────────────────────────────────────────────── -->
	<section id="navigation" class="group">
		<h2>Navigation</h2>
		<div class="cases">
			<div class="case is-wide">
				<span class="case-label">PageHeader and Breadcrumb</span>
				<div class="stack">
					<Breadcrumb
						items={[
							{ label: 'Admin', href: '#top' },
							{ label: 'Orders', href: '#top' },
							{ label: 'DK-1005' }
						]}
					/>
					<PageHeader
						eyebrow="Orders"
						title="DK-1005"
						standfirst="Placed by Karim, going to Dhaka."
					>
						{#snippet actions()}
							<Button size="sm" variant="quiet">Print label</Button>
							<Button size="sm">Book a courier</Button>
						{/snippet}
					</PageHeader>
				</div>
			</div>

			<div class="case is-wide">
				<span class="case-label">Tabs</span>
				<Tabs
					bind:value={tab}
					items={[
						{ value: 'orders', label: 'Orders' },
						{ value: 'products', label: 'Products' },
						{ value: 'payouts', label: 'Payouts' },
						{ value: 'staff', label: 'Staff', disabled: true }
					]}
				>
					{#snippet panel(value)}
						<p class="panel-note">The {value} panel.</p>
					{/snippet}
				</Tabs>
			</div>

			<div class="case is-wide">
				<span class="case-label">Pagination</span>
				<Pagination bind:page pageCount={12} />
			</div>
		</div>
	</section>

	<!-- ── Containers ──────────────────────────────────────────────────── -->
	<section id="containers" class="group">
		<h2>Containers</h2>
		<p class="note">
			<code>Frame</code> is the one bordered box: a tinted shell carrying the header, and the
			content on paper inset by a 3px rail. Nothing else draws its own card.
		</p>
		<div class="cases">
			<div class="case">
				<span class="case-label">Frame · rows</span>
				<Frame eyebrow="Today" title="Recent orders" action="View all" actionHref="#top" variant="rows">
					<a class="line" href="#top">
						<Avatar name="Karim Hossain" size="sm" />
						<span class="line-main">
							<span class="line-title">Karim</span>
							<span class="line-meta">DK-1005 · Dhaka</span>
						</span>
						<span class="line-amt">৳6,100.00</span>
						<Status status="placed" />
					</a>
					<a class="line" href="#top">
						<Avatar name="Rahim Uddin" size="sm" />
						<span class="line-main">
							<span class="line-title">Rahim Uddin</span>
							<span class="line-meta">DK-1004 · Barguna</span>
						</span>
						<span class="line-amt">৳4,500.00</span>
						<Status status="delivered" />
					</a>
				</Frame>
			</div>

			<div class="case">
				<span class="case-label">Frame · pad, with a footer</span>
				<Frame eyebrow="Payouts" title="Next payment" variant="pad" tag="Thursday">
					<p class="prose">
						৳18,240.00 clears on Thursday, once the two parcels still with a rider are settled.
					</p>
					{#snippet footer()}
						<span>Paid into City Bank ····4821</span>
					{/snippet}
				</Frame>
			</div>

			<div class="case">
				<span class="case-label">Stat</span>
				<div class="stats">
					<Stat label="Orders today" value="37" sub="842 this month" href="#top" />
					<Stat label="To send" value="26" sub="ready for a courier" tone="warning" />
				</div>
			</div>

			<div class="case">
				<span class="case-label">Empty and Divider</span>
				<div class="stack">
					<Frame eyebrow="Empty" title="Nothing here" variant="flush">
						<Empty title="No orders yet" description="They appear the moment one comes in.">
							{#snippet actions()}
								<Button size="sm" variant="quiet">Share your shop</Button>
							{/snippet}
						</Empty>
					</Frame>
					<Divider label="Or" />
				</div>
			</div>
		</div>
	</section>

	<!-- ── Data ────────────────────────────────────────────────────────── -->
	<section id="data" class="group">
		<h2>Data</h2>
		<div class="cases">
			<div class="case is-wide">
				<span class="case-label">Table</span>
				<Table caption="Orders waiting on a courier">
					<thead>
						<tr>
							<th scope="col">Order</th>
							<th scope="col">Customer</th>
							<th scope="col">Total</th>
							<th scope="col">State</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="t-mono">DK-1005</td>
							<td>Karim</td>
							<td class="t-mono num">৳6,100.00</td>
							<td><Status status="placed" /></td>
						</tr>
						<tr>
							<td class="t-mono">DK-1004</td>
							<td>Rahim Uddin</td>
							<td class="t-mono num">৳4,500.00</td>
							<td><Status status="delivered" /></td>
						</tr>
					</tbody>
				</Table>
			</div>

			<div class="case is-wide">
				<span class="case-label">Accordion</span>
				<Accordion items={faq} bind:open={openAccordion} panel={answer} />
			</div>
		</div>
	</section>

	{#snippet answer(value: string)}
		<p class="prose">{answers[value]}</p>
	{/snippet}

	<!-- ── People ──────────────────────────────────────────────────────── -->
	<section id="people" class="group">
		<h2>People</h2>
		<div class="cases">
			<div class="case">
				<span class="case-label">Avatar</span>
				<div class="row is-baseline">
					<Avatar name="Anwar Sadat" size="xs" />
					<Avatar name="Karim Hossain" size="sm" />
					<Avatar name="Rahim Uddin" />
					<Avatar name="Nusrat Jahan" size="lg" online />
					<Avatar name="করিম হোসেন" />
				</div>
			</div>

			<div class="case">
				<span class="case-label">Search, the composed shape</span>
				<div class="search">
					<span class="search-glyph" aria-hidden="true">
						<HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.8} />
					</span>
					<Input placeholder="Search by name or order number" aria-label="Search" />
				</div>
			</div>
		</div>
	</section>

	<!-- ── The rest ────────────────────────────────────────────────────── -->
	<section id="rest" class="group">
		<h2>Also in the library</h2>
		<p class="note">
			Six components cannot be shown as a specimen, because each is the page rather than a part of
			it. They are listed so this page is the whole system.
		</p>
		<ul class="rest">
			<li>
				<span class="rest-name"><code>Toaster</code></span>
				<span>Mounted once in the root layout, not per page. The toasts above come out of it.</span>
			</li>
			<li>
				<span class="rest-name"><code>Section</code></span>
				<span>A band with a heading and a lead, the width of the page.</span>
			</li>
			<li>
				<span class="rest-name"><code>SectionHead</code></span>
				<span>A marketing heading with its reveal — it reads <code>mk-</code> tokens.</span>
			</li>
			<li>
				<span class="rest-name"><code>CtaBand</code></span>
				<span>
					The closing band of a marketing page. There is one at the foot of this one.
				</span>
			</li>
			<li>
				<span class="rest-name"><code>Link</code> and <code>Wordmark</code></span>
				<span>Site chrome, shown in place in the header and the footer.</span>
			</li>
		</ul>
	</section>

	<footer class="rule-note">
		Values live in <code>src/lib/tokens.css</code>. Surfaces bind them in
		<code>src/lib/styles/</code>. Components live in <code>src/lib/ui/</code> and read only the
		standard names. The foundations they are built on are at the top of this page.
	</footer>
</div>

<Dialog
	bind:open={dialogOpen}
	title="Book a courier"
	description="The rider collects from your address."
	size="md"
>
	<div class="stack">
		<Field label="Courier">
			{#snippet control(props)}
				<Select {...props} options={couriers} bind:value={courier} />
			{/snippet}
		</Field>
		<Field label="Note for the rider" hint="Optional.">
			{#snippet control(props)}
				<Textarea {...props} rows={3} placeholder="Ring the bell twice" />
			{/snippet}
		</Field>
	</div>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (dialogOpen = false)}>Not now</Button>
		<Button size="sm" onclick={() => (dialogOpen = false)}>Book it</Button>
	{/snippet}
</Dialog>

<Confirm bind:open={confirmOpen} title="Cancel DK-1005?" description="The customer will be told.">
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (confirmOpen = false)}>Keep it</Button>
		<Button variant="danger" size="sm" onclick={() => (confirmOpen = false)}>
			Cancel the order
		</Button>
	{/snippet}
</Confirm>

<Drawer bind:open={drawerOpen} title="DK-1005" description="Placed by Karim, going to Dhaka.">
	<div class="stack">
		<Stat label="Total" value="৳6,100.00" sub="Cash on delivery" />
		<Divider label="Items" />
		<p class="prose">Two shirts and a scarf, packed and waiting on a rider.</p>
	</div>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (drawerOpen = false)}>Close</Button>
		<Button size="sm" onclick={() => (drawerOpen = false)}>Book a courier</Button>
	{/snippet}
</Drawer>

<style>
	.library {
		padding-block: 8px 96px;
	}

	.masthead {
		max-width: 68ch;
		margin-bottom: 56px;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.lede {
		margin: 10px 0 0;
		font-size: clamp(28px, 3.6vw, 40px);
		font-weight: 700;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.dek {
		margin: 14px 0 0;
		color: var(--muted);
		line-height: 1.6;
	}

	code {
		font-family: var(--font-mono);
		font-size: 12.5px;
		color: var(--ink);
	}

	.group {
		padding-top: 32px;
		border-top: 1px solid var(--rule);
		/* Clears the sticky bar, so a jump from the index lands on the heading
		   rather than behind it. */
		scroll-margin-top: 84px;
	}

	.group + .group {
		margin-top: 48px;
	}

	.group h2 {
		margin: 0;
		font-size: 20px;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.note {
		max-width: 62ch;
		margin: 10px 0 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.cases {
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(0, 1fr);
		margin-top: 24px;
	}

	/* A specimen is a labelled box, and the label is the only chrome it gets —
	   the components inside are meant to be what is looked at. */
	.case {
		min-width: 0;
		padding: 20px;
		border: 1px solid var(--rule);
		border-radius: var(--r-card);
		background: var(--paper);
	}

	.case-label {
		display: block;
		margin-bottom: 16px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}

	.is-baseline {
		align-items: center;
		gap: 18px;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.is-tight {
		gap: 8px;
	}

	.inline {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: var(--muted);
	}

	.icon-btn {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		color: var(--ink);
	}

	/* The field and its action stack below sm — side by side on a phone leaves
	   the input too narrow to read and the button too narrow to name. */
	.submit-row {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 18px;
	}

	@media (min-width: 640px) {
		.submit-row {
			flex-direction: row;
			align-items: flex-end;
		}

		.submit-row :global(.field) {
			flex: 1;
		}
	}

	/* A dotted underline says there is more behind the name, and the pointer
	   says it is a thing you can use. `cursor: help` — which draws a question
	   mark — is for a definition, not for a record. */
	/* A dotted underline says there is more behind the name; the pointer says
	   it is a thing you can use. `cursor: help` — which draws a question mark —
	   is for a definition, not for a record. */
	.hc-link {
		padding: 0;
		border: 0;
		background: none;
		color: var(--ink);
		font: inherit;
		cursor: pointer;
	}

	.hc-name {
		text-decoration: underline;
		text-decoration-style: dotted;
		text-underline-offset: 3px;
		text-decoration-color: var(--rule-hover);
	}

	.hc-link:hover .hc-name {
		text-decoration-color: var(--accent);
		color: var(--accent);
	}

	.who {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.who-name {
		margin: 0;
		font-weight: 650;
	}

	.who-meta {
		margin: 2px 0 0;
		font-size: 12.5px;
		color: var(--faint);
	}

	.who-note {
		margin: 12px 0 0;
		font-size: 13px;
		color: var(--muted);
	}

	.group-set {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.group-set legend {
		margin-bottom: 4px;
		padding: 0;
		color: var(--faint);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.prose {
		margin: 0;
		font-size: 14px;
		line-height: 1.65;
		color: var(--muted);
	}

	.panel-note {
		margin: 0;
		font-size: 14px;
		color: var(--muted);
	}

	.line {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: var(--r-control);
		color: inherit;
		text-decoration: none;
	}

	.line:hover {
		background: var(--surface);
	}

	.line-main {
		flex: 1;
		min-width: 0;
	}

	.line-title {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
	}

	.line-meta {
		display: block;
		font-size: 12px;
		color: var(--faint);
	}

	.line-amt {
		font-size: 12.5px;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.num {
		font-variant-numeric: tabular-nums;
	}

	/* The glyph sits over the input rather than beside it, so the field keeps
	   its full width and its own focus ring. */
	.search {
		position: relative;
	}

	.search-glyph {
		position: absolute;
		top: 50%;
		left: 14px;
		z-index: 1;
		display: grid;
		place-items: center;
		color: var(--faint);
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search :global(input) {
		padding-left: 42px;
	}

	.rest {
		display: grid;
		gap: 1px;
		margin-top: 24px;
		background: var(--rule);
		border: 1px solid var(--rule);
		border-radius: var(--r-tile);
		overflow: hidden;
	}

	.rest li {
		display: grid;
		gap: 4px;
		padding: 14px 16px;
		background: var(--paper);
		font-size: 13.5px;
	}

	.rest span {
		color: var(--faint);
	}

	.rest-name {
		color: var(--ink);
	}


	.rule-note {
		margin-top: 56px;
		padding-top: 22px;
		border-top: 1px solid var(--rule);
		font-size: 13px;
		line-height: 1.7;
		color: var(--muted);
	}


	@media (min-width: 860px) {
		.cases {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.is-wide {
			grid-column: 1 / -1;
		}
	}
</style>
