import { productDetailActions, productDetailLoad } from '$lib/server/catalogue';

export const load = productDetailLoad('/v1/admin');
export const actions = productDetailActions('/v1/admin');
