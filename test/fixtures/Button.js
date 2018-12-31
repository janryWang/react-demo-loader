import React, { Fragment } from "react"
import PropTypes from 'prop-types'
const readmeRE = /readme.md/i

const ReactDocRenderer = ({docs})=>{
  const readmes = docs.filter(({path})=>readmeRE.test(path))
  const normals = docs.filter(({path})=>!readmeRE.test(path))
  return (
    <Fragment>
      {normals.map(({component})=>{
        return React.createElement(component)
      })}
      {readmes.map(({component})=>{
        return React.createElement(component)
      })}
    </Fragment>
  )
}

ReactDocRenderer.propTypes = {
  /**
    This is document collection.
    Array<{path:String,component:Function,meta:Object}>
  */
  docs: PropTypes.array.isRequired,

}

module.exports = ReactDocRenderer
