import React, { useState } from 'react'
import createScatterplot from './d3/createScatterplot'
import useCreateChart from '../hooks/useCreateChart'
import useResponsiveness from '../hooks/useResponsiveness'

function Scatterplot (props) {
  const [domElement, setDomElement] = useState(null)

  const [width, height] = useResponsiveness({ ...props, domElement })
  useCreateChart({ ...props, domElement, width, height }, createScatterplot)

  return (
    <div ref={domElement => setDomElement(domElement)} />
  )
}

export default Scatterplot
