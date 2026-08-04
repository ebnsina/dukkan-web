<script lang="ts">
	import * as v from 'valibot';
	import {
		Button,
		Checkbox,
		Field,
		Input,
		Radio,
		Section,
		Select,
		Switch,
		Textarea
	} from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const SellerSchema = v.object({
		shop: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(2, 'A shop name needs at least two letters.'),
			v.maxLength(60, 'Keep the shop name under sixty letters.')
		),
		email: v.pipe(
			v.string(),
			v.trim(),
			v.nonEmpty('We need an email to send the invitation.'),
			v.email('That email does not look right. Check it and try again.')
		),
		cut: v.pipe(
			v.string(),
			v.nonEmpty('Set the cut you will take.'),
			v.transform(Number),
			v.number('The cut has to be a number.'),
			v.minValue(0, 'The cut cannot be less than zero.'),
			v.maxValue(50, 'Fifty is the highest cut allowed.')
		)
	});

	let form = $state({ shop: '', email: '', cut: '' });
	let errors = $state<Record<string, string>>({});
	let done = $state(false);

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const result = v.safeParse(SellerSchema, form);
		errors = result.success
			? {}
			: Object.fromEntries(
					result.issues.map((issue) => [String(issue.path?.[0]?.key ?? ''), issue.message])
				);
		done = result.success;
	}

	const districts = [
		{ value: 'dhaka', label: 'Dhaka' },
		{ value: 'chattogram', label: 'Chattogram' },
		{ value: 'khulna', label: 'Khulna' },
		{ value: 'sylhet', label: 'Sylhet' },
		{ value: 'rangpur', label: 'Rangpur (not yet)', disabled: true }
	];

	let district = $state('dhaka');
	let courier = $state('steadfast');
	let cash = $state(true);
	let autoPay = $state(false);
	let notify = $state(true);
	let some = $state(true);
</script>

<Section
	id="forms"
	eyebrow="05 / Forms"
	heading="Fields, and how they fail."
	lead="Every control is 46px, rounded to the control step, and shares one hairline. An error takes the danger colour on both the message and its rule — the one thing on a form that must not read as ordinary text."
	rule
>
	<DsBlock label="Text" flow="stack">
		<div class="pair">
			<Field label="Shop name" hint="Your customers will see this." required>
				{#snippet control(props)}
					<Input {...props} placeholder="Nokshi Home" />
				{/snippet}
			</Field>
			<Field label="Orders a month" hint="Numbers use Geist Mono.">
				{#snippet control(props)}
					<Input {...props} numeric inputmode="numeric" placeholder="5000" />
				{/snippet}
			</Field>
			<Field label="Email" error="That email does not look right. Check it and try again.">
				{#snippet control(props)}
					<Input {...props} value="owner@" type="email" />
				{/snippet}
			</Field>
			<Field label="Seller number" hint="We give this out.">
				{#snippet control(props)}
					<Input {...props} value="DK-VN-0042" disabled />
				{/snippet}
			</Field>
		</div>

		<Field label="Notes" hint="For your team. Sellers never see it.">
			{#snippet control(props)}
				<Textarea {...props} placeholder="Anything the shop floor should know." />
			{/snippet}
		</Field>
	</DsBlock>

	<DsBlock label="Choice" flow="stack">
		<div class="pair">
			<div class="stack">
				<Select options={districts} bind:value={district} aria-label="District" />
				<Select
					invalid
					placeholder="Pick a courier"
					options={[
						{ value: 'steadfast', label: 'Steadfast' },
						{ value: 'pathao', label: 'Pathao' }
					]}
					bind:value={courier}
					aria-label="Courier"
				/>
			</div>
			<div class="stack">
				<Checkbox bind:checked={notify} label="Email me when an order lands" />
				<Checkbox bind:indeterminate={some} label="Select all sellers" description="Part-picked." />
				<Checkbox checked={false} label="Turned off" disabled />
				<Radio
					bind:group={courier}
					value="steadfast"
					label="Steadfast"
					description="Cash anywhere."
				/>
				<Radio
					bind:group={courier}
					value="pathao"
					label="Pathao"
					description="Same day in Dhaka."
				/>
				<Radio bind:group={courier} value="redx" label="RedX" disabled />
			</div>
		</div>

		<div class="stack">
			<Switch bind:checked={cash} label="Take cash on delivery" />
			<Switch bind:checked={autoPay} label="Pay sellers every week" description="Sundays, 22:00." />
			<Switch checked disabled label="Turned off" />
		</div>
	</DsBlock>

	<DsBlock label="Checked with valibot" note="Submit empty to see the messages." flow="stack">
		<form onsubmit={submit} class="form">
			<Field label="Shop name" required error={errors.shop}>
				{#snippet control(props)}
					<Input {...props} bind:value={form.shop} placeholder="Nokshi Home" />
				{/snippet}
			</Field>
			<Field label="Owner email" required error={errors.email}>
				{#snippet control(props)}
					<Input {...props} bind:value={form.email} type="email" placeholder="owner@example.com" />
				{/snippet}
			</Field>
			<Field label="Your cut" required hint="Between zero and fifty." error={errors.cut}>
				{#snippet control(props)}
					<Input {...props} bind:value={form.cut} numeric inputmode="decimal" placeholder="12" />
				{/snippet}
			</Field>

			<div class="submit">
				<Button type="submit" arrow>Invite the seller</Button>
				{#if done}<span class="ok t-label">Ready to send</span>{/if}
			</div>
		</form>
	</DsBlock>
</Section>

<style>
	.pair {
		display: grid;
		gap: 24px;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 420px;
	}

	.submit {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.ok {
		color: var(--ink);
		font-weight: 600;
	}

	@media (min-width: 720px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px 32px;
		}
	}
</style>
