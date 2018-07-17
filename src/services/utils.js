/**
 * Lookup an object property by dot notation
 * @param  {Object} obj - object to perform lookup
 * @param  {String} key - property location
 * @param  {Any} fallback - fallback if not found
 * @return {Any} returns value of lookup if found, otherwise undefined
 */
export const get = (obj, key, fallback) =>
  key
    .split('.')
    .reduce((state, x) => (state && state[x] ? state[x] : null), obj) ||
  fallback
