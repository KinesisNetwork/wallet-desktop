import * as React from 'react'

const StepAnimation: React.SFC<{ animation: any; alt: string }> = props => (
  <div className="level">
    <div className="level-item">
      <figure className="image" style={{ height: '200px', width: '200px' }}>
        <img src={props.animation} alt={props.alt} />
      </figure>
    </div>
  </div>
)

export { StepAnimation }
