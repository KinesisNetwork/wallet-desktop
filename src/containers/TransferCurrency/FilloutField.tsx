import { InputField } from '@components/InputField';
import { FormUpdate, TransferRequest } from '@types';
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  handleChange: (formData: FormUpdate<TransferRequest>) => void
  contactName: string
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
          />
          <div className="level">
            <div className="level-left">
              <div className="field">
                <input
                  id="switchRoundedSuccess"
                  type="checkbox"
                  name="switchRoundedSuccess"
                  className="switch is-rounded is-success"
                  checked={true}
                  onChange={() => null}
                />
                <label>Save to contacts</label>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    )
  }
}

export { FilloutFieldPresentation as FilloutField }
