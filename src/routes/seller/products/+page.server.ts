import { productListActions, productListLoad } from '$lib/server/catalogue';

export const load = productListLoad('/v1/vendor');
export const actions = productListActions('/v1/vendor');
