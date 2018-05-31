import * as React from 'react'

export interface Props {
  value: string
  label: string
  id: string
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
}) => (
    <div className='field'>
      <label className='label is-small'>{label}</label>
      <div className='control'>
        <input
          className='input'
          id={`input-${id}`}
          onChange={(ev) => onChangeHandler(ev.target.value)}
          type={isPassword ? 'password' : 'text'}
          placeholder={placeholder}
          value={value}
        />
      </div>
      <p className='help is-link'>
        {helpText}
      </p>
    </div>
  )
