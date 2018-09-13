import * as React from 'react'

export interface Props {
  id: string
  value: string
  label?: string
  icon?: string
  helpText?: string
  errorText?: string
  type?: 'password' | 'text' | 'number'
  button?: React.ReactElement<any>
  onChangeHandler: (newValue: string) => any
}

const InputField: React.SFC<Props & React.InputHTMLAttributes<HTMLInputElement>> = ({
  value,
  label,
  onChangeHandler,
  id,
  helpText,
  icon,
  errorText,
  button,
  ...inputProps
}) => (
  <div className={`field ${button ? 'is-grouped' : ''}`}>
    {label && <label className="label is-small">{label}</label>}
    <div className={`control ${icon ? 'has-icons-left' : ''} ${button ? 'is-expanded' : ''}`}>
      <input
        className={`input ${errorText ? 'is-danger' : ''}`}
        id={`input-${id}`}
        onChange={ev => onChangeHandler(ev.target.value)}
        value={value}
        {...inputProps}
      />
      {icon && (
        <span className={`icon is-left has-text-grey-lighter`}>
          <i className={`fal fa-lg ${icon}`} />
        </span>
      )}
      <p className={`help ${errorText ? 'is-danger' : ''}`}>{errorText || helpText}</p>
    </div>
    {button}
  </div>
)

export { InputField }
