export interface Toast {
	id: string;
	title: string;
	description?: string;
	duration: number;
}

class ToastStore {
	items = $state<Toast[]>([]);

	push(input: Omit<Toast, 'id' | 'duration'> & { duration?: number }) {
		const toast: Toast = { id: crypto.randomUUID(), duration: 5000, ...input };
		this.items = [...this.items, toast];
		if (toast.duration > 0) setTimeout(() => this.dismiss(toast.id), toast.duration);
		return toast.id;
	}

	dismiss(id: string) {
		this.items = this.items.filter((item) => item.id !== id);
	}

	clear() {
		this.items = [];
	}
}

export const toasts = new ToastStore();
