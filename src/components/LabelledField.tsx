import * as copy from 'copy-to-clipboard'
import * as React from 'react'

export interface Props {
  label: string
  value: string
  icon?: string
  isLoading?: boolean
  isCompact?: boolean
  isClipped?: boolean
  addon?: React.ReactNode
  isCopyable?: boolean
}

const clippedStyle = (isClipped: boolean | undefined) => (isClipped ? { maxWidth: '35ch' } : {})

export const LabelledField: React.SFC<Props> = props => (
  <div className="field">
    <label className="label is-small">{props.label}</label>
    <div className="field is-grouped">
      <div
        className={`control is-expanded ${props.isLoading && 'is-loading'}`}
        style={clippedStyle(props.isClipped)}
      >
        {props.isCopyable && (
          <button
            className="button is-text is-paddingless"
            onClick={() => copy(props.value)}
            title="Click to copy"
          >
            {props.value}
          </button>
        )}
        {!props.isCopyable && <p className="input is-static">{props.value}</p>}
      </div>
      {props.addon && <div className="control">{props.addon}</div>}
    </div>
  </div>
)

LabelledField.displayName = 'LabelledField'

export const HorizontalLabelledField: React.SFC<Props> = props => (
  <div className={`field is-horizontal ${props.isCompact ? 'is-marginless' : ''}`}>
    <div className="field-label is-small">
      <label className="label">{props.label}</label>
    </div>
    <div className="field-body">
      <div className="field is-grouped">
        <div
          className={`control ${props.isLoading && 'is-loading'}`}
          style={clippedStyle(props.isClipped)}
        >
          <p className="input is-static is-small is-block">{props.value}</p>
        </div>
        {props.addon && <div className="control">{props.addon}</div>}
      </div>
    </div>
  </div>
)

HorizontalLabelledField.displayName = 'HorizontalLabelledField'
