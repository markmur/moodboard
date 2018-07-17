import PropTypes from 'prop-types'

export const userPropTypes = PropTypes.shape({
  uid: PropTypes.string
})

export const storePropTypes = PropTypes.shape({
  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
  board: PropTypes.object
})

export const historyPropTypes = PropTypes.shape({
  replace: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.object
  })
})
