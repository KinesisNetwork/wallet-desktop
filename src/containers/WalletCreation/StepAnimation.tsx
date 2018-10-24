import * as React from 'react'

const StepAnimation: React.SFC<{ animation: any }> = props => (
  <figure className="image" style={{ height: '200px', width: '200px', margin: '0 auto' }}>
    <img src={props.animation} />
  </figure>
)

export { StepAnimation }
