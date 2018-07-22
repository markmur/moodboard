/* eslint-disable react/no-unused-state */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { userPropTypes } from '../prop-types'
import { get } from '../services/utils'
import { queries, setDefaultState } from '../services/queries'
import { DOC, COLLECTION } from '../services/constants'

const defaultState = {}

const { Provider, Consumer } = React.createContext(defaultState)

class FirebaseProvider extends Component {
  static propTypes = {
    user: userPropTypes,
    children: PropTypes.any.isRequired
  }

  static defaultProps = {
    user: {}
  }

  constructor() {
    super()

    const defaultStoreState = Object.keys(queries).reduce(
      (state, key) => ({
        ...state,
        ...setDefaultState(key, queries[key].type)
      }),
      {}
    )

    const actions = {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      setGlobalLoadingState: this.setGlobalLoadingState,
      documentExists: this.documentExists
    }

    this.state = {
      // Global loading state
      loading: false,
      // Default state for all queries { loading, hasData, data }
      ...defaultStoreState,
      // Actions
      ...actions
    }

    this.subscriptions = {}
  }

  componentWillUnmount() {
    // Unsubscribe from all subscriptions
    Object.values(this.subscriptions).map(x => typeof x === 'function' && x())
  }

  subscribe = (query, ...args) => {
    if (!(query in queries) || typeof query !== 'string') {
      throw new Error('Query does not exist')
    }

    const { type } = queries[query]

    const lastArg = args.slice().pop()
    const callback = typeof lastArg === 'function' ? lastArg : () => {}

    this.setLoadingState(query, true)

    this.subscriptions[query] = queries[query]
      .get(this.props.user.uid, ...args)
      .onSnapshot((snapshot, err) => {
        if (err) console.log('err from snapshot watcher', err)

        if (type === DOC) {
          const { exists } = snapshot

          callback(snapshot.data())

          if (!exists) return
        }

        if (type === COLLECTION) {
          callback(get(snapshot, 'docs', []).map(x => x.data()))
        }

        return type === COLLECTION
          ? this.setCollectionToState(query, snapshot)
          : this.setDocumentToState(query, snapshot)
      })

    return this.subscriptions[query]
  }

  unsubscribe = query => {
    this.setState(setDefaultState(query, queries[query].type))

    return query in this.subscriptions && typeof this.subscriptions[query]
      ? this.subscriptions[query]()
      : null
  }

  setLoadingState = (key, loading, global = true) =>
    this.setState(state => ({
      loading: global ? loading : false,
      [key]: {
        ...state[key],
        loading
      }
    }))

  setGlobalLoadingState = loading =>
    this.setState({
      loading
    })

  setCollectionToState = (key, snapshot) =>
    this.setState({
      loading: false,
      [key]: {
        loading: false,
        hasData: get(snapshot, 'docs', []).length > 0,
        data: get(snapshot, 'docs', []).map(x => ({
          ...x.data(),
          id: x.id
        }))
      }
    })

  setDocumentToState = (key, snapshot) =>
    this.setState({
      loading: false,
      [key]: {
        loading: false,
        hasData: snapshot.exists,
        data: snapshot.data() || {}
      }
    })

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

export { Consumer }

export default FirebaseProvider
