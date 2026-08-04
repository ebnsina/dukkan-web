/* The component library.
 *
 * One set of components for all three surfaces. A component reads the standard
 * token names — --paper, --ink, --accent — and each surface rebinds those to
 * its own values (.dk-app for the admin, .mk-surface for the marketing site,
 * .shop-surface for a storefront). Nothing is forked to change a colour.
 *
 * Where one place genuinely needs something different, pass `class` at the
 * call site; every component merges it last.
 *
 * Previewed at /ds.
 */

export { default as Accordion } from './Accordion.svelte';
export { default as Avatar } from './Avatar.svelte';
export { default as Banner } from './Banner.svelte';
export { default as Breadcrumb } from './Breadcrumb.svelte';
export { default as Button } from './Button.svelte';
export { default as Checkbox } from './Checkbox.svelte';
export { default as Chip } from './Chip.svelte';
export { default as Confirm } from './Confirm.svelte';
export { default as CtaBand } from './CtaBand.svelte';
export { default as Dialog } from './Dialog.svelte';
export { default as Divider } from './Divider.svelte';
export { default as Drawer } from './Drawer.svelte';
export { default as Empty } from './Empty.svelte';
export { default as Field } from './Field.svelte';
export { default as Frame } from './Frame.svelte';
export { default as HoverCard } from './HoverCard.svelte';
export { default as Input } from './Input.svelte';
export { default as Link } from './Link.svelte';
export { default as Menu } from './Menu.svelte';
export { default as PageHeader } from './PageHeader.svelte';
export { default as Pagination } from './Pagination.svelte';
export { default as Progress } from './Progress.svelte';
export { default as Pulse } from './Pulse.svelte';
export { default as Radio } from './Radio.svelte';
export { default as Section } from './Section.svelte';
export { default as SectionHead } from './SectionHead.svelte';
export { default as Select } from './Select.svelte';
export { default as Skeleton } from './Skeleton.svelte';
export { default as Spinner } from './Spinner.svelte';
export { default as Stat } from './Stat.svelte';
export { default as Status } from './Status.svelte';
export { default as Table } from './Table.svelte';
export { default as Tabs } from './Tabs.svelte';
export { default as Textarea } from './Textarea.svelte';
export { default as Toaster } from './Toaster.svelte';
export { default as Toggle } from './Toggle.svelte';
export { default as Tooltip } from './Tooltip.svelte';
export { default as Wordmark } from './Wordmark.svelte';

export { toasts } from './toast.svelte';
export { trapFocus } from './focus-trap';

export type { Tone } from './tone';
export type { AccordionItem } from './Accordion.svelte';
export type { Crumb } from './Breadcrumb.svelte';
export type { FieldControl } from './Field.svelte';
export type { MenuItem } from './Menu.svelte';
export type { SelectOption } from './Select.svelte';
export type { TabItem } from './Tabs.svelte';
export type { Toast, ToastAction } from './toast.svelte';
export type { Align, Side } from './position';
export { place, track } from './position';
