import { replace } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { finaliseWalletCreation } from '@actions'
import { FinaliseSetupModal } from '@containers/WalletCreation/FinaliseSetupModal'
import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import * as animation from 'images/verify-phrase-animation.gif'
import { StepAnimation } from './StepAnimation'

interface InputProps {
  placeholder: string
  isValid: boolean
  currentValue: string
  handleInput: (newValue: string) => any
}

class PassphraseWordInput extends React.Component<InputProps> {
  render() {
    return (
      <div className="field">
        <div className="control has-icons-right">
          <input
            type="text"
            className={`is-large input has-text-centered ${
              this.props.isValid ? 'is-success' : 'is-danger'
            }`}
            value={this.props.currentValue}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
          />
          {/* Need to have both since fa updates differently to react */}
          <span className={`icon is-right has-text-success ${!this.props.isValid && 'is-hidden'}`}>
            <i className="fal fa-check-circle" />
          </span>
          <span className={`icon is-right has-text-danger ${this.props.isValid && 'is-hidden'}`}>
            <i className="fal fa-times-circle" />
          </span>
        </div>
      </div>
    )
  }
  handleChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    const { handleInput } = this.props
    handleInput(ev.currentTarget.value)
  }
}

interface PassphraseCheckProps {
  passphrase: string[]
  handleVerification(isVerified: boolean): any
}

interface PassphraseState {
  validInputs: Record<string, string>
}
class PassphraseCheck extends React.Component<PassphraseCheckProps, PassphraseState> {
  idsToCheck = [3, 7, 9]
  rowCutoffIndexes = [0, 4, 8] // 12 word seedphrase / 3 rows
  constructor(props) {
    super(props)
    this.state = {
      validInputs: {},
    }
  }

  componentDidMount() {
    this.setState({
      validInputs: this.props.passphrase.reduce(
        (acc, curr, index) => (this.idsToCheck.includes(index) ? { ...acc, [curr]: '' } : acc),
        {},
      ),
    })
  }

  render() {
    return <div className="tile is-ancestor is-vertical">{this.passphraseSplit()}</div>
  }

  passphraseSplit = () =>
    this.rowCutoffIndexes.map(rowSplit => (
      <div className="tile is-parent" key={rowSplit}>
        {this.props.passphrase.slice(rowSplit, rowSplit + 4).map((word, splitIndex) => (
          <div className="tile is-child" key={word}>
            {this.idsToCheck.includes(rowSplit + splitIndex) ? (
              <PassphraseWordInput
                currentValue={this.state.validInputs[word] || ''}
                handleInput={newValue => this.handleInput(word, newValue)}
                placeholder={`Word ${rowSplit + splitIndex + 1}`}
                isValid={(this.state.validInputs[word] || '').toLowerCase() === word}
              />
            ) : (
              <input
                type="text"
                className="input is-static is-large has-text-centered"
                value={`${rowSplit + splitIndex + 1}. ${word}`}
                readOnly={true}
                disabled={true}
              />
            )}
          </div>
        ))}
      </div>
    ))

  handleInput = (key: string, newValue: string) => {
    this.setState({ validInputs: { ...this.state.validInputs, [key]: newValue } }, () =>
      this.props.handleVerification(this.isVerified()),
    )
  }

  isVerified = () =>
    Object.entries(this.state.validInputs).every(
      ([expected, current]) => expected === current.toLowerCase(),
    )
}

const mapStateToProps = (state: RootState) => ({
  passphrase: state.createWallet.passphrase,
})

const mapDispatchToProps = {
  goBack: () => replace(RootRoutes.create + WalletCreationRoutes.second),
  handleConfirm: finaliseWalletCreation,
}
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
class ValidatePassphrasePresentation extends React.Component<Props, any> {
  state = {
    isVerified: false,
    activeModal: false,
  }

  render() {
    return (
      <React.Fragment>
        <StepAnimation animation={animation} alt="" />
        <h1 className="title has-text-centered has-text-primary">Verify your recovery phrase</h1>
        <div className="content">
          <p>
            To make sure your recovery phrase was recorded correctly, please verify the missing
            words below.
          </p>
        </div>
        <div className="tile is-ancestor is-vertical">
          <PassphraseCheck
            passphrase={this.props.passphrase.split(' ')}
            handleVerification={isVerified => this.setState({ isVerified })}
          />
        </div>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button className="button is-text" onClick={this.props.goBack}>
              Back
            </button>
          </div>
          <div className="control">
            <button
              className="button is-primary"
              disabled={!this.state.isVerified}
              onClick={this.handleVerifyClick}
            >
              Verify
            </button>
          </div>
        </div>
        <FinaliseSetupModal
          isActive={this.state.activeModal}
          closeModal={this.closeModal}
          handleConfirm={this.props.handleConfirm}
        />
      </React.Fragment>
    )
  }

  handleVerifyClick = () => this.setState({ activeModal: true })
  closeModal = () => this.setState({ activeModal: false })
}

const ConnectedValidatePassphrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidatePassphrasePresentation)

export { ConnectedValidatePassphrase as ValidatePassphrase }
