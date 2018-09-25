import { push, replace } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { createPassphrase } from '@actions'
import { TermsAndConditions } from '@components/TermsAndConditions'
import { validateMnemonic } from '@services/passphrase'
import { RootRoutes, WalletRecoverRoutes } from '@types'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  goBack: () => dispatch(replace(RootRoutes.dashboard)),
  onSubmitPassphrase: (passphrase: string) => {
    dispatch(createPassphrase({ passphrase }))
    dispatch(push(RootRoutes.recover + WalletRecoverRoutes.third))
  }
})

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
interface State {
  hasConfirmedTC: boolean
  isValidPassphrase: boolean
  recoveryPhrase: string
}

export class ImportPassphrasePresentation extends React.Component<Props, State> {
  state: State = {
    hasConfirmedTC: false,
    isValidPassphrase: false,
    recoveryPhrase: '',
  }
  
  handleConfirmTC: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    this.setState({ hasConfirmedTC: ev.target.checked })
  }

  handlePhraseChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.target
    const isValidPassphrase = validateMnemonic(value)

    this.setState({ recoveryPhrase: value, isValidPassphrase })
  }

  handlePhraseSubmit = () => {
    this.props.onSubmitPassphrase(this.state.recoveryPhrase)
  }

  render() {
    const { goBack } = this.props
    const { hasConfirmedTC, isValidPassphrase, recoveryPhrase } = this.state
    
    return (
      <React.Fragment>
        <h1 className="title has-text-primary has-text-centered">Restore your wallet</h1>
        <div className="content">
          <p>
            Your recovery phrase is the 12 word phrase you recorded when the wallet was created. <a>Learn More</a>.
          </p>
        </div>
        <div className="field">
          <label className="label" htmlFor="recovery-phrase">Your recovery phrase</label>
          <div className="control">
            <input
              type="textarea"
              className={`textarea seedphrase has-text-centered is-radiusless ${ isValidPassphrase ? 'is-success' : 'is-danger' }`}
              id="recovery-phrase"
              name="recovery-phrase"
              onChange={this.handlePhraseChange}
              placeholder="Separate each word with a space"
              value={recoveryPhrase}
            />
            <p className="help">Your recovery phrase is not case sensitive</p>
          </div>
        </div>
        <TermsAndConditions
          hasConfirmed={hasConfirmedTC}
          onConfirmChange={this.handleConfirmTC}
        />
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button type="button" className="button is-text" onClick={goBack}>
              Back
            </button>
          </div>
          <div className="control">
            <button
              className="button is-primary"
              disabled={!(hasConfirmedTC && isValidPassphrase)}
              onClick={this.handlePhraseSubmit}
            >
              Restore
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const ImportPassphrase = connect(mapStateToProps, mapDispatchToProps)(ImportPassphrasePresentation)

export { ImportPassphrase }