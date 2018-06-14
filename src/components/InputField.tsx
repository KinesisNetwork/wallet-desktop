import * as React from 'react'

export interface Props {
  id: string
  value: string
  label?: string
  icon?: string
  helpText?: string
  placeholder?: string
  type?: 'password' | 'text' | 'number'
  isDisabled?: boolean
  onChangeHandler: (newValue: string) => any
}

export const InputField: React.SFC<Props> = ({
  value,
  label,
  onChangeHandler,
  type = 'text',
  id,
  helpText,
  placeholder,
  icon,
  isDisabled,
}) => (
    <div className='field'>
      {label && <label className='label is-small'>{label}</label>}
      <div className={`control ${icon ? 'has-icons-left' : ''}`}>
        <input
          className='input'
          id={`input-${id}`}
          onChange={(ev) => onChangeHandler(ev.target.value)}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
        />
        {icon && <span className='icon is-left has-text-grey-lighter'><i className={`fas ${icon}`} /></span>}
      </div>
      <p className='help is-link'>
        {helpText}
      </p>
    </div>
  )
