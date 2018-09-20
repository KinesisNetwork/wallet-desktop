import * as React from 'react'

interface Props {
  icon?: string,
  isActive?: boolean,
  onClick?: () => void,
  subtitle?: string,
  title: string,
  titleClassName?: string
}

export const DropdownItem: React.SFC<Props> = ({ icon, isActive = false, onClick, subtitle, title, titleClassName }) => (
  <div
    className={`dropdown-item is-paddingless ${isActive && 'is-active'}`}
    onClick={onClick}
  >
    <a className="button is-radiusless is-fullwidth is-shadowless">
      <span className="icon">
        {isActive ?
          <i className="fal fa-lg fa-check-circle" /> : icon ?
          <i className={`fal fa-lg fa-${icon}`} /> : null
        }
      </span>
      <div className="dropdown-item-text vertical-spaced">
        <p className={titleClassName}>
          {title}
        </p>
        {subtitle && (
          <p className="is-size-7">
            {subtitle}
          </p>
        )}
      </div>
    </a>
  </div>
)