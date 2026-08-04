/* The one vocabulary of state, shared by every surface.
 *
 * It lives with the components rather than under admin/, because a chip on the
 * storefront means the same thing as a chip in the admin. */
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
