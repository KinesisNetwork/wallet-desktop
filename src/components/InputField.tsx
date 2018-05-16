import * as React from 'react'

export interface Props {
  value: string
  label: string
  id: string
  isPassword?: boolean
  onChangeHandler: (newValue: string) => any
}

export const InputField: React.SFC<Props> = ({value, label, onChangeHandler, isPassword, id}) => (
  <div className='field'>
    <label className='label is-small'>{label}</label>
    <div className='control'>
      <input
        className='input'
        id={`input-${id}`}
        onChange={(ev) => onChangeHandler(ev.target.value)}
        type={isPassword ? 'password' : 'text'}
        value={value}
      />
    </div>
  </div>
)
