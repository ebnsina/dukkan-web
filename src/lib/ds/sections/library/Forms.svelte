<script lang="ts">
	import { Checkbox, Divider, Field, Input, Radio, Select, Textarea, Toggle } from '$lib/ui';
	import { couriers } from './specimens';

	let toggled = $state(true);
	let agreed = $state(false);
	let partial = $state(true);
	let payment = $state('bkash');
	let courier = $state('pathao');
</script>

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

<style>
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
</style>
