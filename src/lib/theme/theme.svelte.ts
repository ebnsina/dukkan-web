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
		if (browser) document.documentElement.dataset.theme = this.resolved;
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

	toggle() {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}
}

export const theme = new ThemeStore();
