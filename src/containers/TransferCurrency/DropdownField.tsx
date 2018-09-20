import * as React from 'react'

interface Props {
  isDropdownField: boolean
}

export const DropdownFieldPresentation: React.SFC<Props> = () => (
  <React.Fragment>
    <label className="label is-small">To</label>
    <div className="field is-grouped">
      <div className="control is-expanded">
        <div className="select is-fullwidth payee-select">
          <select className="has-text-grey">
            <option>Select a contact</option>
            <option>Name 1</option>
            <option>Name 2</option>
            <option>Name 3</option>
          </select>
        </div>
      </div>
      <div className="control is-flex">
        <span className="is-uppercase is-size-7 has-text-grey-lighter" style={{ alignSelf: 'center' }}>or</span>
      </div>
      <div className="control">
        <button className="button is-primary">Add new</button>
      </div>
    </div>
  </React.Fragment>

)

export { DropdownFieldPresentation as DropdownField }
