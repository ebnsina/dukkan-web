import { productDetailActions, productDetailLoad } from '$lib/server/catalogue';

export const load = productDetailLoad('/v1/vendor');
export const actions = productDetailActions('/v1/vendor');
