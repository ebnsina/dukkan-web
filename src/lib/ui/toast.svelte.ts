import type { Tone } from './tone';

export interface ToastAction {
	label: string;
	onclick: () => void;
}

export interface Toast {
	id: string;
	title: string;
	description?: string;
	tone: Tone;
	/** One thing to do about it — undo, retry, go and look. */
	action?: ToastAction;
	/** A toast waiting on something stays until it is resolved. */
	loading?: boolean;
	duration: number;
}

type Input = Omit<Toast, 'id' | 'duration' | 'tone'> & { tone?: Tone; duration?: number };

class ToastStore {
	items = $state<Toast[]>([]);
	/* One timer per toast, so a toast answered in place restarts its clock
	   rather than inheriting the countdown of what it used to say. */
	#timers = new Map<string, ReturnType<typeof setTimeout>>();

	#schedule(toast: Toast) {
		clearTimeout(this.#timers.get(toast.id));
		this.#timers.delete(toast.id);
		if (toast.duration > 0 && !toast.loading) {
			this.#timers.set(
				toast.id,
				setTimeout(() => this.dismiss(toast.id), toast.duration)
			);
		}
	}

	push(input: Input) {
		const toast: Toast = {
			id: crypto.randomUUID(),
			tone: 'neutral',
			duration: 5000,
			...input
		};
		this.items = [...this.items, toast];
		this.#schedule(toast);
		return toast.id;
	}

	success(title: string, rest: Partial<Input> = {}) {
		return this.push({ ...rest, title, tone: 'success' });
	}

	error(title: string, rest: Partial<Input> = {}) {
		return this.push({ ...rest, title, tone: 'danger' });
	}

	/* Work that is still running gets one toast, not two: it goes up as
	   loading and is answered in place, so the notice a merchant is already
	   reading becomes the result rather than being replaced underneath. */
	update(id: string, patch: Partial<Input>) {
		this.items = this.items.map((item) =>
			item.id === id ? { ...item, ...patch, loading: patch.loading ?? false } : item
		);
		const next = this.items.find((item) => item.id === id);
		if (next) this.#schedule(next);
	}

	dismiss(id: string) {
		clearTimeout(this.#timers.get(id));
		this.#timers.delete(id);
		this.items = this.items.filter((item) => item.id !== id);
	}

	clear() {
		for (const timer of this.#timers.values()) clearTimeout(timer);
		this.#timers.clear();
		this.items = [];
	}
}

export const toasts = new ToastStore();
