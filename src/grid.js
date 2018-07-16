import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'

const chunk = (array, size) =>
  [].concat.apply(
    [],
    array.map((elem, i) => (i % size ? [] : [array.slice(i, i + size)]))
  )

export default class Grid extends Component {
  static propTypes = {
    containerPadding: PropTypes.number,
    margin: PropTypes.number,
    maxWidth: PropTypes.number,
    columns: PropTypes.number,
    layout: PropTypes.array,
    children: PropTypes.array
  }

  static defaultProps = {
    containerPadding: 40,
    margin: 20,
    maxWidth: 1440,
    columns: 4,
    layout: [],
    children: null
  }

  heights = []

  calculateLayout = memoize(list => {
    if (!list || list.length < 0) return []

    const { margin, columns } = this.props
    const grid = chunk(list, columns)

    const columnWidth = Math.floor(window.innerWidth / columns) - margin

    const transforms = []
    let cache = []

    grid.forEach(row => {
      row.forEach((item, index) => {
        transforms.push([
          index * columnWidth + margin,
          (cache[index] || 0) + margin
        ])
      })

      cache = row.map((item, i) => this.heights[i] + margin)
    })

    return React.Children.map(list, (child, index) => {
      const [x, y] = transforms[index]

      return React.cloneElement(child, {
        ref: c => {
          if (c && c.clientHeight) this.heights.push(c.clientHeight)
        },
        style: {
          position: 'absolute',
          width:
            this.props.maxWidth / this.props.columns - this.props.margin * 2,
          top: y + this.props.margin,
          left: x,
          transition: 'all 250ms ease'
        }
      })
    })
  })

  render() {
    const layout = this.calculateLayout(this.props.children)

    return <div style={{ position: 'relative' }}>{layout}</div>
  }
}
