<section id="rest" class="group">
	<h2>Also in the library</h2>
	<p class="note">
		Six components cannot be shown as a specimen, because each is the page rather than a part of it.
		They are listed so this page is the whole system.
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
			<span>The closing band of a marketing page. There is one at the foot of this one.</span>
		</li>
		<li>
			<span class="rest-name"><code>Link</code> and <code>Wordmark</code></span>
			<span>Site chrome, shown in place in the header and the footer.</span>
		</li>
	</ul>
</section>

<style>
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
</style>
