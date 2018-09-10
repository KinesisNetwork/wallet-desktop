import { Icon } from '@components/Icon'
import { Icons } from '@types';
import * as React from 'react'

export interface Props {
  id: string
  value: string
  label?: string
  icon?: Icons
  helpText?: string
  placeholder?: string
  type?: 'password' | 'text' | 'number'
  isDisabled?: boolean
  hasButton?: boolean
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
  hasButton,
  isDisabled,
}) => (
    <div className={`field ${hasButton ? 'control is-expanded' : ''}`}>
      {label && <label className='label is-small'>{label}</label>}
      <div className={`control ${icon ? `has-icons-${icon.position}` : ''}`}>
        <input
          className='input'
          id={`input-${id}`}
          onChange={(ev) => onChangeHandler(ev.target.value)}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
        />
        {icon && <Icon type={icon.type} position={icon.position} colour={icon.colour} />}
      </div>
      <p className='help is-link'>
        {helpText}
      </p>
    </div>
  )

InputField.displayName = 'InputField'
