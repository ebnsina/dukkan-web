<script lang="ts">
	import {
		Banner,
		Button,
		Chip,
		Field,
		Progress,
		Pulse,
		Select,
		Skeleton,
		Spinner,
		Status,
		toasts,
		type Tone
	} from '$lib/ui';
	import { couriers } from './specimens';

	const tones: Tone[] = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

	let courier = $state('pathao');
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
</script>

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

<style>
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
</style>
