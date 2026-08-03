<script lang="ts">
	import { Wordmark } from '$lib/ui';
	import { formatDate } from '$lib/utils/format';

	const groups = [
		{
			title: 'Product',
			links: [
				{ href: '/#what-you-get', label: 'What you get' },
				{ href: '/#how-it-works', label: 'How it works' },
				{ href: '/#pricing', label: 'Pricing' },
				{ href: '/ds', label: 'Design system' }
			]
		},
		{
			title: 'Built in',
			links: [
				{ href: '/#what-you-get', label: 'bKash and Nagad' },
				{ href: '/#what-you-get', label: 'SSLCommerz' },
				{ href: '/#what-you-get', label: 'Steadfast and Pathao' },
				{ href: '/#what-you-get', label: 'Cash on delivery' }
			]
		},
		{
			title: 'Company',
			links: [
				{ href: '/#questions', label: 'Questions' },
				{ href: '/#start', label: 'Talk to us' }
			]
		}
	];

	const year = formatDate(new Date(), 'en-BD', { year: 'numeric' });
</script>

<footer class="footer">
	<div class="container-page">
		<div class="grid">
			<div>
				<Wordmark />
				<p class="blurb">Your own marketplace. Many sellers, one shopfront, your name on it.</p>
			</div>

			{#each groups as group (group.title)}
				<div>
					<h2 class="heading t-label">{group.title}</h2>
					<ul>
						{#each group.links as link (link.label)}
							<li><a href={link.href}>{link.label}</a></li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="base">
			<p class="small t-mono">&copy; {year} Dukkan</p>
			<p class="small t-mono">Dhaka, Bangladesh</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--rule);
		padding-block: clamp(48px, 6vw, 80px) 32px;
	}

	.grid {
		display: grid;
		gap: 40px;
	}

	.blurb {
		margin-top: 16px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
		max-width: 30ch;
	}

	.heading {
		color: var(--faint);
		margin-bottom: 16px;
	}

	li + li {
		margin-top: 10px;
	}

	a {
		font-size: 14px;
		color: var(--muted);
		text-decoration: none;
		transition: color var(--dur-hover) var(--ease-out);
	}

	a:hover {
		color: var(--ink);
	}

	.base {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		margin-top: clamp(48px, 6vw, 80px);
		padding-top: 24px;
		border-top: 1px solid var(--rule);
	}

	.small {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}

	@media (min-width: 700px) {
		.grid {
			grid-template-columns: 1.6fr repeat(3, 1fr);
			gap: 32px;
		}
	}
</style>
