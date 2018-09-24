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
  subtitle,
  title,
  titleClassName,
}) => (
  <div className={`dropdown-item is-paddingless ${isActive && 'is-active'}`} onClick={onClick}>
    <a className="button is-radiusless is-fullwidth is-shadowless" style={{ overflow: 'visible' }}>
      <span className={`icon ${!icon && 'is-hidden'}`}>
        <i className={`fal fa-lg fa-${icon}`} />
      </span>
      <span className={`icon ${!isActive && 'is-hidden'}`}>
        <i className="fal fa-lg fa-check-circle" />
      </span>
      <span className={`icon ${(isActive || icon) && 'is-hidden'}`} />
      <div className="dropdown-item-text vertical-spaced">
        <p className={titleClassName}>{title}</p>
        {subtitle && <p className="is-size-7">{subtitle}</p>}
      </div>
      <span className={`icon ${!isImport && 'is-hidden'} tooltip`} data-tooltip="Imported account">
        <i className={`fal fa-sm fa-download`} />
      </span>
      <span className={`icon ${isImport && 'is-hidden'}`} />
    </a>
  </div>
)
