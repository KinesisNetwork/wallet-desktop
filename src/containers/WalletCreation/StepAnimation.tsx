import * as React from 'react'

const StepAnimation: React.SFC<{ animation: any; alt: string }> = props => (
  <figure className="image" style={{ height: '200px', width: '200px', margin: '0 auto' }}>
    <img src={props.animation} alt={props.alt} />
  </figure>
)

export { StepAnimation }
