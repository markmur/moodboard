export const DEFAULT_WIDTH = 400

export const calculateDimensions = ({ width, height }) => {
  const defaultWidth = width > DEFAULT_WIDTH ? DEFAULT_WIDTH : width

  return {
    width: defaultWidth,
    height: Number((height / (width / defaultWidth)).toFixed(2))
  }
}

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

export const preloadImages = images =>
  Promise.all(
    images.map(
      image =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.addEventListener('load', () => resolve(img))
          img.addEventListener('error', reject)
          img.src = image
        })
    )
  )

export const getImageDimensions = url => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')

    img.addEventListener('error', reject)

    img.addEventListener('load', () => {
      return resolve({
        width: img.width,
        height: img.height
      })
    })

    img.src = url
  })
}
