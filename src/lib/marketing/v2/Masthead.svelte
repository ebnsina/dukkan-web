<script lang="ts">
	/* The head of the page, printed the way a book's is: a rule, a mark, and
	   what the book is for. It stays put while the page scrolls because the
	   action it carries is the only one on the page. */
</script>

<header class="sticky top-0 z-40 border-b border-lg-rule bg-lg-paper">
	<div class="lg-wrap flex h-[60px] items-center justify-between gap-6">
		<a href="#top" class="flex items-baseline gap-3">
			<span class="font-lg-head text-[17px] font-medium tracking-tight">Dukk&agrave;n</span>
			<span class="lg-label hidden text-lg-faint sm:inline">Shop software for Bangladesh</span>
		</a>

		<div class="flex items-center gap-6">
			<a href="/admin/signin" class="lg-label text-lg-muted hover:text-lg-ink">Sign in</a>
			<a
				href="/signup"
				class="rounded-[3px] bg-lg-ink px-4 py-2.5 font-lg-num text-[11px] font-medium tracking-[0.1em] text-lg-paper uppercase transition-colors duration-200 hover:bg-lg-brand"
			>
				Open a shop
			</a>
		</div>
	</div>
</header>
