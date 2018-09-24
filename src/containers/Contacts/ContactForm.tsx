import * as React from 'react'
import { connect } from 'react-redux'

import { addContact } from '@actions'
import { InputField } from '@components/InputField'
import { isValidPublicKey } from '@services/kinesis'
import { RootState } from '@store'
import { Contact } from '@types'

interface State extends Contact {
  errors: { [key in keyof Contact]?: string }
  isValid: boolean
}

const mapStateToProps = (state: RootState) => ({
  currentContacts: state.contacts.contactList,
})

const mapDispatchToProps = {
  addContact,
}

type StateFulProps = { hideForm: () => any } & typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>
class ContractFormStateful extends React.Component<StateFulProps, State> {
  state: State = {
    name: '',
    address: '',
    errors: {},
    isValid: false,
  }

  render() {
    return (
      <ContactFormPresentation
        {...this.state}
        handleChange={this.handleChange}
        cancel={this.props.hideForm}
        addContact={this.handleAdd}
      />
    )
  }

  private handleAdd = () => {
    const possibleErrors = this.validateForm()
    this.setState({ errors: possibleErrors })

    const isValid = Object.values(possibleErrors).every(error => error === '')
    if (!isValid) {
      return
    }

    const { name, address } = this.state
    this.props.addContact({ name, address })
    this.props.hideForm()
  }

  private handleChange = (key: string, value: string) => {
    this.setState(state => ({ ...state, [key]: value }))
  }

  private validateForm = () => {
    const errors = {
      address:
        (isValidPublicKey(this.state.address) ? '' : 'Invalid address') ||
        (this.props.currentContacts.every(({ address }) => this.state.address !== address)
          ? ''
          : 'Address already in contacts'),
      name: this.props.currentContacts.every(({ name }) => name !== this.state.name)
        ? ''
        : 'Name already in contacts',
    }
    return errors
  }
}

interface Props extends State {
  handleChange: (key: keyof Contact, value: string) => any
  cancel: () => any
  addContact: () => any
}

const ContactFormPresentation: React.SFC<Props> = props => (
  <React.Fragment>
    <div className="field is-grouped">
      <div className="control">
        <InputField
          label="Name"
          value={props.name}
          name="name"
          id="contact-name"
          onChangeHandler={value => props.handleChange('name', value)}
          icon="fa-user"
          maxLength={20}
          helpText={`Characters: ${props.name.length}/20`}
          errorText={props.errors.name}
        />
      </div>
      <div className="control is-expanded">
        <InputField
          label="Account Number"
          value={props.address}
          name="address"
          id="contact-account"
          onChangeHandler={value => props.handleChange('address', value)}
          icon="fa-passport"
          placeholder="e.g. GDUL65KWF..."
          errorText={props.errors.address}
        />
      </div>
      <div className="control">
        <div className="field">
          <label className="label is-small">&nbsp;</label>
          <div className="control">
            <button
              className="button is-success"
              onClick={props.addContact}
              disabled={!props.address || !props.name}
            >
              <span className="icon">
                <i className="fal fa-lg fa-check" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="control">
        <div className="field">
          <label className="label is-small">&nbsp;</label>
          <div className="control">
            <button className="button is-danger" onClick={props.cancel}>
              <span className="icon">
                <i className="fal fa-lg fa-times" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr className="has-background-grey-lighter" />
  </React.Fragment>
)

const ConnectedContactForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContractFormStateful)

export { ConnectedContactForm as ContactForm }
