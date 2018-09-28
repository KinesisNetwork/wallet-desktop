import * as React from 'react'

interface Props {
  icon?: string
  isImport?: boolean
  isActive?: boolean
  onClick?: () => void
  subtitle?: string
  title: string
  titleClassName?: string
}

export const DropdownItem: React.SFC<Props> = ({
  icon,
  isImport = false,
  isActive = false,
  onClick,
  title,
  titleClassName,
}) => (
  <div className={`dropdown-item is-paddingless ${isActive && 'is-active'}`} onClick={onClick}>
    <a className="button is-radiusless is-fullwidth is-shadowless" style={{ overflow: 'visible' }}>
      {icon && (
        <span className={`icon`}>
          <i className={`fal fa-lg fa-${icon}`} />
        </span>
      )}
      {isActive && (
        <span className={`icon`}>
          <i className="fal fa-lg fa-check-circle" />
        </span>
      )}
      {!isActive && !icon && <span className={`icon`} />}
      <span className={titleClassName}>{title}</span>
      {isImport && (
        <span className={`icon tooltip`} data-tooltip="Imported account">
          <i className={`fal fa-sm fa-download`} />
        </span>
      )}
      {!isImport && <span className={`icon`} />}
    </a>
  </div>
)
