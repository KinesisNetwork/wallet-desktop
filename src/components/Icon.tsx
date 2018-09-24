import * as React from 'react'

export interface Props {
  type: string
  position: string
  colour: string
}

export const Icon: React.SFC<Props> = ({ type, position, colour }) => (
  <span className={`icon is-${position} has-text-${colour}`}>
    <i className={`fas ${type}`} />
  </span>
)
