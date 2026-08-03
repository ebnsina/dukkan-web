import type { Attachment } from 'svelte/attachments';
import { detectTier, isFinePointer } from '$lib/motion/capability.svelte';

/* The control leans toward the pointer. Fine pointers and full motion only. */
export function magnetic(strength = 0.28): Attachment {
	return (element) => {
		if (detectTier() !== 'full' || !isFinePointer()) return;

		const node = element as HTMLElement;
		let frame = 0;

		function move(event: PointerEvent) {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const rect = node.getBoundingClientRect();
				const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
				const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
				node.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
			});
		}

		function reset() {
			cancelAnimationFrame(frame);
			node.style.transform = '';
		}

		node.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)';
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', reset);

		return () => {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', reset);
			node.style.transform = '';
			node.style.transition = '';
		};
	};
}
