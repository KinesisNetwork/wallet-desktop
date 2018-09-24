import { InputField } from '@components/InputField'
import { FormErrors } from '@types'
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  handleChange: (field: 'name' | 'address', value: string) => void
  errors: FormErrors
  onSaveToContactsChange: () => void
  saveToContacts: boolean
  name: string
  publicKey: string
}

export class FilloutFieldPresentation extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <div className="field" style={{ position: 'relative' }}>
          <button
            className="button is-outlined is-light"
            style={{ position: 'absolute', left: '-15%', top: '1.47rem' }}
            onClick={this.props.onFieldChange}
          >
            <span className="icon">
              <i className="fal fa-lg fa-angle-left" />
            </span>
          </button>
          <InputField
            label="Contact name"
            value={this.props.name}
            onChangeHandler={value => this.props.handleChange('name', value)}
            id="contact-name"
            icon="fa-user-circle"
            name="name"
            disabled={!this.props.saveToContacts}
          />
          <InputField
            label="Public Address"
            value={this.props.publicKey}
            placeholder="example: &quot;GDUL65KWQ4PJA7FLO6467...CM7G&quot;"
            onChangeHandler={value => this.props.handleChange('address', value)}
            id="public-address"
            icon="fa-qrcode"
            errorText={this.props.errors.targetPayee}
          />
          <div className="level">
            <div className="level-left">
              <div className="field">
                <input
                  id="switchRoundedSuccess"
                  type="checkbox"
                  name="switchRoundedSuccess"
                  className="switch is-rounded is-success"
                  onChange={this.props.onSaveToContactsChange}
                  checked={this.props.saveToContacts}
                />
                <label htmlFor="switchRoundedSuccess">Save to contacts</label>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export { FilloutFieldPresentation as FilloutField }
