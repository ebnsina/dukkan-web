<script lang="ts">
	/* Who can sign in to this shop.
	 *
	 * The owner is shown and cannot be touched: the API refuses it, and a row
	 * offering a button that will be refused is a worse answer than no button. */
	import { enhance } from '$app/forms';
	import { PlusSignIcon } from '@hugeicons/core-free-icons';
	import {
		Button,
		Chip,
		Confirm,
		Drawer,
		Field,
		Frame,
		Radio,
		Select,
		Table,
		toasts
	} from '$lib/ui';
	import type { StaffMember } from '$lib/admin/types';

	interface Props {
		staff: StaffMember[];
		fields: Record<string, string>;
	}

	let { staff, fields }: Props = $props();

	let adding = $state(false);
	let removing = $state<StaffMember | null>(null);
	let role = $state<'staff' | 'admin'>('staff');
	let formVersion = $state(0);

	const ROLES = [
		{ value: 'staff', label: 'Staff' },
		{ value: 'admin', label: 'Admin' }
	];

	/* What each role may do, in the one place a shop owner is choosing between
	   them. The rule itself lives in the API; this is the sentence for it. */
	const WHAT_THEY_CAN_DO: Record<string, string> = {
		owner: 'Everything, including payment and delivery details.',
		admin: 'Everything, including payment and delivery details.',
		staff: 'Day to day. Not payment or delivery details.'
	};

	function done(message: string) {
		toasts.success(message);
	}
</script>

<Frame eyebrow="People" title="Who can sign in" variant="rows">
	<Table caption="Staff">
		<thead>
			<tr>
				<th scope="col">Number</th>
				<th scope="col">Name</th>
				<th scope="col">Role</th>
				<th scope="col">Can do</th>
				<th scope="col"><span class="sr-only">Actions</span></th>
			</tr>
		</thead>
		<tbody>
			{#each staff as person (person.user_id)}
				<tr>
					<td class="t-mono">{person.phone}</td>
					<td>{person.name || '—'}</td>
					<td>
						{#if person.role === 'owner'}
							<Chip tone="accent" label="Owner" />
						{:else}
							<form
								method="POST"
								action="?/staffRole"
								use:enhance={() =>
									async ({ result, update }) => {
										await update({ reset: false });
										if (result.type === 'success') done('Their role is changed.');
									}}
							>
								<input type="hidden" name="id" value={person.user_id} />
								<Select
									name="role"
									options={ROLES}
									value={person.role}
									aria-label="Role for {person.phone}"
									onchange={(event) =>
										(event.currentTarget as HTMLSelectElement).form?.requestSubmit()}
								/>
							</form>
						{/if}
					</td>
					<td class="dk-hint">{WHAT_THEY_CAN_DO[person.role]}</td>
					<td class="right">
						{#if person.role !== 'owner'}
							<Button size="sm" variant="quiet" onclick={() => (removing = person)}>Remove</Button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	{#snippet footer()}
		<Button size="sm" icon={PlusSignIcon} onclick={() => (adding = true)}>New person</Button>
	{/snippet}
</Frame>

<Drawer bind:open={adding} size="wide" title="New person">
	{#key formVersion}
		<form
			method="POST"
			action="?/staffAdd"
			use:enhance={() =>
				async ({ result, update }) => {
					await update({ reset: false });
					if (result.type === 'success') {
						done('They can sign in now.');
						role = 'staff';
						formVersion += 1;
						adding = false;
					} else if (result.type === 'failure') {
						const message = (result.data as { message?: string } | undefined)?.message;
						if (message) toasts.error(message);
					}
				}}
			class="dk-form"
		>
			<Field
				label="Mobile number"
				required
				hint="They sign in with a code sent to this number."
				error={fields.phone}
			>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input t-mono"
						name="phone"
						inputmode="tel"
						placeholder="01712345678"
						autocomplete="off"
						required
					/>
				{/snippet}
			</Field>

			<Field label="Name">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="name" autocomplete="off" />
				{/snippet}
			</Field>

			<fieldset class="roles">
				<legend class="t-label">Role</legend>
				<Radio
					bind:group={role}
					name="role"
					value="staff"
					label="Staff"
					description={WHAT_THEY_CAN_DO.staff}
				/>
				<Radio
					bind:group={role}
					name="role"
					value="admin"
					label="Admin"
					description={WHAT_THEY_CAN_DO.admin}
				/>
			</fieldset>

			<div class="dk-acts">
				<Button type="submit">Save</Button>
			</div>
		</form>
	{/key}
</Drawer>

<Confirm
	open={removing !== null}
	title="Remove {removing?.name || removing?.phone}?"
	description="They stop being able to sign in. Anything they ordered as a customer is untouched."
>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (removing = null)}>Keep them</Button>
		<form
			method="POST"
			action="?/staffRemove"
			use:enhance={() =>
				async ({ result, update }) => {
					removing = null;
					await update({ reset: false });
					if (result.type === 'success') done('They can no longer sign in.');
				}}
		>
			<input type="hidden" name="id" value={removing?.user_id ?? ''} />
			<Button type="submit" variant="danger" size="sm">Remove</Button>
		</form>
	{/snippet}
</Confirm>

<style>
	.right {
		text-align: right;
	}

	.roles {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.roles legend {
		margin-bottom: 6px;
		padding: 0;
		color: var(--d-faint);
	}
</style>
