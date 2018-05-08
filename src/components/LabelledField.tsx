import * as React from 'react'

export interface Props {
  label: string
  value: string
  icon?: string
  isLoading?: boolean
}

export const LabelledField: React.SFC<Props> = (props) => (
  <div className='field'>
    <label className='label is-small'>{props.label}</label>
    <p className={`control is-expanded ${props.isLoading && 'is-loading'}`}>
      <input className='input is-static' type='text' value={props.value} readOnly={true} />
    </p>
  </div>
)
