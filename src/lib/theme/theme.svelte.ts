import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'dukkan-theme';

function systemPrefersDark(): boolean {
	return browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

class ThemeStore {
	preference = $state<ThemePreference>('system');

	init() {
		if (!browser) return;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			this.preference = stored === 'light' || stored === 'dark' ? stored : 'system';
		} catch {
			this.preference = 'system';
		}
		this.apply();
	}

	get resolved(): 'light' | 'dark' {
		if (this.preference !== 'system') return this.preference;
		return systemPrefersDark() ? 'dark' : 'light';
	}

	private apply() {
		if (!browser) return;
		document.documentElement.dataset.theme = this.resolved;
	}

	set(next: ThemePreference) {
		this.preference = next;
		if (!browser) return;
		try {
			if (next === 'system') localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* storage blocked — the choice still applies for this session */
		}
		this.apply();
	}

	/* Clipped open as a circle from the switch, scoped by its own class so it
	   does not collide with the page cross-fade on the same root snapshot. */
	toggleFrom(origin?: { x: number; y: number }) {
		const next = this.resolved === 'dark' ? 'light' : 'dark';
		const root = document.documentElement;

		if (!browser || !document.startViewTransition) {
			this.set(next);
			return;
		}

		root.style.setProperty('--theme-x', `${origin?.x ?? window.innerWidth / 2}px`);
		root.style.setProperty('--theme-y', `${origin?.y ?? 0}px`);
		root.classList.add('theme-transition');

		const transition = document.startViewTransition(() => this.set(next));
		transition.finished.finally(() => root.classList.remove('theme-transition'));
	}
}

export const theme = new ThemeStore();
