<script lang="ts">
	import { Accordion, Status, Table } from '$lib/ui';
	import { answers, faq } from './specimens';

	let openAccordion = $state(['fees']);
</script>

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

<style>
	.num {
		font-variant-numeric: tabular-nums;
	}
</style>
