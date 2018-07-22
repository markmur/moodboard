import ow from 'ow'

window.ow = ow

export const checkStrLength = (length = 1) =>
  ow.create(ow.string.minLength(length))
