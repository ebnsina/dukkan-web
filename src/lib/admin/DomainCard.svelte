<script lang="ts">
	/* Putting a shop on its own web address, which is three steps in the world
	   and so three states here: nothing yet, claimed and waiting on DNS, and
	   live. The middle state is the one that matters — somebody is reading this
	   with their registrar open in another window, so the record is spelled out
	   rather than described. */
	import { enhance } from '$app/forms';
	import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';
	import { CheckmarkCircle02Icon, RefreshIcon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Chip, Field, Frame } from '$lib/ui';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import type { DomainStatus } from '$lib/admin/types';

	interface Props {
		domain: DomainStatus;
		shopSlug: string;
		/** Whether the plan carries it; the API refuses either way. */
		included: boolean;
		message?: string;
	}

	let { domain, shopSlug, included, message }: Props = $props();

	const waiting = $derived(!!domain.domain && !domain.verified);
</script>

<Frame
	eyebrow="Web address"
	title="Where your shop lives"
	action={domain.verified ? 'Live' : waiting ? 'Waiting on DNS' : ''}
	variant="pad"
>
	{#if message}
		<div class="msg"><Banner title="Not done" tone="danger">{message}</Banner></div>
	{/if}

	<p class="dk-note">
		Your shop is always at <span class="dk-num">{shopSlug}.{PUBLIC_SHOP_DOMAIN}</span>, and that
		never stops working. You can also put it on a domain you own.
	</p>

	{#if !included}
		<Banner title="Not on your plan" tone="info">
			Using your own web address comes with a bigger plan. Your shop stays where it is until then.
		</Banner>
	{:else if domain.verified}
		<div class="live">
			<Chip tone="success" label="Live" icon={CheckmarkCircle02Icon} />
			<a class="dk-num" href="https://{domain.domain}" target="_blank" rel="noreferrer">
				{domain.domain}
			</a>
		</div>
		<p class="dk-hint">
			Customers reaching either address see the same shop. The certificate is issued and renewed for
			you.
		</p>
		<form method="POST" action="?/domainRelease" use:enhance class="act">
			<Button type="submit" variant="quiet" size="sm">Stop using this address</Button>
		</form>
	{:else if waiting}
		<Banner title="One record to add" tone="info">
			Add this at whoever you bought <span class="dk-num">{domain.domain}</span> from, then press the
			button. It can take a few minutes to spread.
		</Banner>

		<dl class="record">
			<div>
				<dt class="dk-eyebrow">Type</dt>
				<dd class="dk-num">{domain.record_type}</dd>
			</div>
			<div>
				<dt class="dk-eyebrow">Name</dt>
				<dd class="dk-num">{domain.record_name}</dd>
			</div>
			<div>
				<dt class="dk-eyebrow">Value</dt>
				<dd class="dk-num">{domain.record_value}</dd>
			</div>
		</dl>

		<div class="act">
			<form method="POST" action="?/domainVerify" use:enhance>
				<Button type="submit" size="sm" icon={RefreshIcon}>I have added it — check now</Button>
			</form>
			<form method="POST" action="?/domainRelease" use:enhance>
				<Button type="submit" variant="quiet" size="sm">Cancel</Button>
			</form>
		</div>
	{:else}
		<div class="act">
			<FormSheet
				title="Your own web address"
				description="A domain you already own. We will show you the one record to add at whoever you bought it from."
				action="?/domainClaim"
				saved="Now add the record it shows you."
			>
				{#snippet trigger(open)}
					<Button size="sm" variant="quiet" onclick={open}>Use my own address</Button>
				{/snippet}

				<Field label="Your own web address" hint="A domain you already own, like shop.example.com.">
					{#snippet control(props)}
						<input
							{...props}
							class="dk-input"
							name="domain"
							placeholder="yourshop.com.bd"
							autocomplete="off"
							spellcheck="false"
						/>
					{/snippet}
				</Field>
			</FormSheet>
		</div>
	{/if}
</Frame>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.live {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 14px 0 8px;
	}

	.record {
		display: grid;
		gap: 12px;
		margin: 16px 0;
		padding: 14px;
		border: 1px solid var(--d-card);
		border-radius: 8px;
	}

	.record dd {
		margin: 4px 0 0;
		/* The value gets copied by hand into another window; it must not wrap
		   into something that looks like two lines of text. */
		word-break: break-all;
		font-size: 13px;
	}

	.act {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}
</style>
