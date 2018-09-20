import * as React from 'react'

interface Props {
  isDropdown: boolean
}

export const PayeeFieldPresentation: React.SFC<Props> = () => (
  <div className="field is-grouped">
    <label className="label is-small">To</label>
    <div className="dropdown">
      <div className="dropdown-trigger">
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>Dropdown</span>
          <span className="icon is-small">
            <i className="fal fa-angle-down" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-context">
          <a href="#" className="dropdown-item">Name 1</a>
          <a href="#" className="dropdown-item">Name 2</a>
          <a href="#" className="dropdown-item">Name 3</a>
        </div>
      </div>
    </div>
    <span className="is-uppercase is-size-7">or</span>
    <button className="button">Add new</button>
  </div>

)

export { PayeeFieldPresentation as PayeeField }
