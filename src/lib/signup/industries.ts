import type { IconSvgElement } from '@hugeicons/svelte';
import {
	Baby01Icon,
	BookOpen01Icon,
	ChefHatIcon,
	ComputerIcon,
	CustomerService01Icon,
	Diamond01Icon,
	Medicine01Icon,
	Note01Icon,
	ShoppingBasket01Icon,
	SmartPhone01Icon,
	SparklesIcon,
	Store01Icon,
	TShirtIcon,
	ToyTrainIcon,
	ToolsIcon,
	WashingMachineIcon
} from '@hugeicons/core-free-icons';

/* The API answers with industry codes only. The words a shop owner reads are
   ours, and they are the trade, not the category — "Groceries", not "grocery". */
const LABELS: Record<string, { label: string; icon: IconSvgElement }> = {
	appliance: { label: 'Home appliances', icon: WashingMachineIcon },
	baby: { label: 'Baby goods', icon: Baby01Icon },
	beauty: { label: 'Beauty and care', icon: SparklesIcon },
	books: { label: 'Books', icon: BookOpen01Icon },
	computer: { label: 'Computers', icon: ComputerIcon },
	electronics: { label: 'Electronics', icon: SmartPhone01Icon },
	fashion: { label: 'Clothing', icon: TShirtIcon },
	food: { label: 'Cooked food', icon: ChefHatIcon },
	general: { label: 'A bit of everything', icon: Store01Icon },
	grocery: { label: 'Groceries', icon: ShoppingBasket01Icon },
	hardware: { label: 'Hardware', icon: ToolsIcon },
	jewellery: { label: 'Jewellery', icon: Diamond01Icon },
	kids: { label: 'Kids', icon: ToyTrainIcon },
	mobile: { label: 'Mobile phones', icon: SmartPhone01Icon },
	pharmacy: { label: 'Pharmacy', icon: Medicine01Icon },
	saree: { label: 'Sarees', icon: TShirtIcon },
	services: { label: 'Services', icon: CustomerService01Icon },
	stationery: { label: 'Stationery', icon: Note01Icon },
	toys: { label: 'Toys', icon: ToyTrainIcon }
};

export function industryLabel(code: string): string {
	return LABELS[code]?.label ?? code;
}

export function industryIcon(code: string): IconSvgElement {
	return LABELS[code]?.icon ?? Store01Icon;
}
