/* eslint-disable react/no-unused-state */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { db } from '../services/firebase'
import { userPropTypes } from '../prop-types'

const defaultState = {}

const { Provider, Consumer } = React.createContext(defaultState)

const COLLECTION = 'collection'
const DOC = 'doc'

const queries = {
  boards: {
    get: uid => db.collection('boards').where(`members.${uid}`, '==', true),
    type: COLLECTION
  },
  board: {
    get: (uid, id) => db.collection('boards').doc(id),
    type: DOC
  },
  images: {
    get: (uid, id) =>
      db
        .collection('boards')
        .doc(id)
        .collection('images'),
    type: COLLECTION
  }
}

const setDefaultState = (key, type) => ({
  [key]: {
    loading: false,
    hasData: false,
    data: type === COLLECTION ? [] : {}
  }
})

class FirebaseProvider extends Component {
  static propTypes = {
    user: userPropTypes
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
      setGlobalLoadingState: this.setGlobalLoadingState
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
    Object.values(this.subscriptions).map(x => typeof x === 'function' && x())
  }

  subscribe = (query, ...args) => {
    if (!(query in queries) || typeof query !== 'string') {
      throw new Error('Query does not exist')
    }

    const { type } = queries[query]

    this.setLoadingState(query, true)

    this.subscriptions[query] = queries[query]
      .get(this.props.user.uid, ...args)
      .onSnapshot(
        type === COLLECTION
          ? this.setCollectionToState(query)
          : this.setDocumentToState(query)
      )
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

  setCollectionToState = key => snapshot =>
    this.setState({
      loading: false,
      [key]: {
        loading: false,
        hasData: snapshot.docs.length > 0,
        data: snapshot.docs.map(x => ({
          ...x.data(),
          id: x.id
        }))
      }
    })

  setDocumentToState = key => snapshot =>
    this.setState({
      loading: false,
      [key]: {
        loading: false,
        hasData: snapshot.exists,
        data: snapshot.data() || {}
      }
    })

  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

export { Consumer }

export default FirebaseProvider
