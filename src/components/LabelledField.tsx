import * as React from 'react'

export interface Props {
  label: string
  value: string
  icon?: string
  isLoading?: boolean
  isCompact?: boolean
  addon?: React.ReactNode
}

export const LabelledField: React.SFC<Props> = (props) => (
  <div className='field'>
    <label className='label is-small'>{props.label}</label>
    <p className={`control is-expanded ${props.isLoading && 'is-loading'}`}>
      <input className='input is-static' type='text' value={props.value} readOnly={true} />
    </p>
  </div>
)

export const HorizontalLabelledField: React.SFC<Props> = (props) => (
  <div className={`field is-horizontal ${props.isCompact ? 'is-marginless' : ''}`}>
    <div className='field-label is-small'>
      <label className='label'>{props.label}</label>
    </div>
    <div className='field-body'>
      <div className={`field ${props.addon ? 'has-addons' : ''}`}>
        <div className={`control is-expanded ${props.isLoading && 'is-loading'}`}>
          <input className='input is-static is-small' type='text' value={props.value} readOnly={true} />
        </div>
        {props.addon && <div className='control'>{props.addon}</div>}
      </div>
    </div>
  </div>
)
