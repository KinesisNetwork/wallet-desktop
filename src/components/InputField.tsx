import * as React from 'react'

export interface Props {
  value: string
  label: string
  id: string
  icon?: string
  helpText?: string
  placeholder?: string
  isPassword?: boolean
  onChangeHandler: (newValue: string) => any
}

export const InputField: React.SFC<Props> = ({
  value,
  label,
  onChangeHandler,
  isPassword,
  id,
  helpText,
  placeholder,
  icon,
}) => (
    <div className='field'>
      <label className='label is-small'>{label}</label>
      <div className={`control ${icon ? 'has-icons-left' : ''}`}>
        <input
          className='input'
          id={`input-${id}`}
          onChange={(ev) => onChangeHandler(ev.target.value)}
          type={isPassword ? 'password' : 'text'}
          placeholder={placeholder}
          value={value}
        />
        {icon && <span className='icon is-left has-text-grey-lighter'><i className={`fas ${icon}`} /></span>}
      </div>
      <p className='help is-link'>
        {helpText}
      </p>
    </div>
  )
