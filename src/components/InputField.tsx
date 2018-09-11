import * as React from 'react'

export interface Props {
  id: string
  value: string
  label?: string
  icon?: string
  helpText?: string
  errorText?: string
  onChangeHandler: (newValue: string) => any
}

export const InputField: React.SFC<Props & React.InputHTMLAttributes<HTMLInputElement>> = ({
  value,
  label,
  onChangeHandler,
  id,
  helpText,
  icon,
  errorText,
  ...inputProps
}) => (
  <div className="field">
    {label && <label className="label is-small">{label}</label>}
    <div className={`control ${icon && 'has-icons-left'}`}>
      <input
        className={`input ${errorText && 'is-danger'}`}
        id={`input-${id}`}
        onChange={ev => onChangeHandler(ev.target.value)}
        value={value}
        {...inputProps}
      />
      {icon && (
        <span className={`icon is-left has-text-grey-lighter`}>
          <i className={`fas ${icon}`} />
        </span>
      )}
    </div>
    <p className={`help ${errorText && 'is-danger'}`}>{errorText || helpText}</p>
  </div>
)

InputField.displayName = 'InputField'
