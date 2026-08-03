import type { Attachment } from 'svelte/attachments';

const FOCUSABLE =
	'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function trapFocus(): Attachment {
	return (element) => {
		const node = element as HTMLElement;
		const previous = document.activeElement as HTMLElement | null;

		function focusable(): HTMLElement[] {
			return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null
			);
		}

		function onkeydown(event: KeyboardEvent) {
			if (event.key !== 'Tab') return;
			const items = focusable();
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		queueMicrotask(() => (focusable()[0] ?? node).focus());
		node.addEventListener('keydown', onkeydown);

		return () => {
			node.removeEventListener('keydown', onkeydown);
			previous?.focus?.();
		};
	};
}
