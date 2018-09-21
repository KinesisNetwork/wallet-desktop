import { InputField } from '@components/InputField';
import { FormErrors, FormUpdate, TransferRequest } from '@types';
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  handleChange: (formData: FormUpdate<TransferRequest>) => void
  contactName: string
  publicKey: string
  errors: FormErrors
  onSaveToContactsChange: () => void
  saveToContacts: boolean
}

// interface State {
//   saveToContacts: boolean
// }

export class FilloutFieldPresentation extends React.Component<Props> {
  // state = {
  //   saveToContacts: true
  // }

  // handleSaveToContact = () => {
  //   this.setState(prevState => ({saveToContacts: !prevState.saveToContacts}))
  // }

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
            label='Contact name'
            value={this.props.contactName}
            onChangeHandler={newValue => this.props.handleChange({ field: 'contactName', newValue })}
            id='contact-name'
            icon='fa-user-circle'
          />
          <InputField
            label='Public Address'
            value={this.props.publicKey}
            placeholder='example: "GDUL65KWQ4PJA7FLO6467...CM7G"'
            onChangeHandler={newValue => this.props.handleChange({ field: 'payeePublicKey', newValue })}
            id='public-address'
            icon='fa-qrcode'
            errorText={this.props.errors.payeePublicKey}
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
      </React.Fragment >
    )
  }
}

export { FilloutFieldPresentation as FilloutField }
