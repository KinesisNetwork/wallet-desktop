import * as React from 'react'

interface Props {
  isExpanded: boolean
  onClick: () => any
  title: string
}

export const DropdownTrigger: React.SFC<Props> = ({ isExpanded, onClick, title }) => (
  <div className={`dropdown-trigger ${isExpanded && 'is-active' }`}>
    <button
      aria-controls="dropdown-menu"
      aria-haspopup="true"
      className="dropdown-button button is-radiusless is-fullwidth"
      onClick={onClick}
    >
      <span className="icon is-large"><i className="fal fa-lg fa-user-circle" /></span>
      <p>{title}</p>
      <span className="icon">
        <i className="fal fa-lg fa-angle-down" aria-hidden="true" />
      </span>
    </button>
  </div>
)
