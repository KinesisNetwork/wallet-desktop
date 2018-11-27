import { push, replace } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { TermsAndConditions } from '@components/TermsAndConditions'
import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import * as animation from 'images/record-phrase-animation.gif'
import { RouteComponentProps } from 'react-router'
import { StepAnimation } from './StepAnimation'

const mapStateToProps = (state: RootState) => ({
  passphrase: state.createWallet.passphrase,
})

const mapDispatchToProps = {
  goBack: () => replace(RootRoutes.create + WalletCreationRoutes.first),
  nextPage: () => push(RootRoutes.create + WalletCreationRoutes.third),
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

type StatefulProps = State & {
  onRecordedChange: React.ChangeEventHandler<HTMLInputElement>
  onConfirmChange: React.ChangeEventHandler<HTMLInputElement>
}

const PassphrasePresentation: React.SFC<Props & StatefulProps> = ({
  passphrase,
  goBack,
  hasRecorded,
  onRecordedChange,
  hasConfirmedTC,
  onConfirmChange,
  nextPage,
}) => (
  <React.Fragment>
    <StepAnimation animation={animation} alt="" />
    <h1 className="title has-text-primary has-text-centered is-spaced">
      Record your recovery phrase
    </h1>
    <h2 className="subtitle has-text-warning has-text-weight-bold">
      This is the only way to recover your wallet if you lose access. Anyone with this will have
      complete access to your wallet.{' '}
      <a href="mailto:marketing@kinesis.money?subject=Kinesis%20record%20recovery%20phrase%20learn%20more%20request&bcc=it@kinesis.money">
        {' '}
        Learn more.
      </a>
    </h2>
    <div className="field">
      <label className="label">Record and secure these 12 words:</label>
      <div className="control">
        <div className="has-text-centered is-unselectable seedphrase">{passphrase}</div>
        <p className="help">Your recovery phrase is not case sensitive</p>
      </div>
    </div>
    <div className="field is-marginless">
      <div className="control">
        <input
          className="is-checkradio"
          id="has-copied"
          type="checkbox"
          name="has-copied"
          checked={hasRecorded}
          onChange={onRecordedChange}
        />
        <label htmlFor="has-copied">
          I confirm I have recorded my recovery phrase and stored it in a safe place
        </label>
      </div>
    </div>
    <TermsAndConditions hasConfirmed={hasConfirmedTC} onConfirmChange={onConfirmChange} />
    <div className="field is-grouped is-grouped-right">
      <div className="control">
        <button type="button" className="button is-text" onClick={goBack}>
          Back
        </button>
      </div>
      <div className="control">
        <button
          className="button is-primary"
          disabled={!hasRecorded || !hasConfirmedTC}
          onClick={nextPage}
        >
          I have saved my recovery phrase
        </button>
      </div>
    </div>
  </React.Fragment>
)

const ConnectedPassphrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PassphrasePresentation)

interface State {
  hasRecorded: boolean
  hasConfirmedTC: boolean
}

class PassphraseStateful extends React.Component<RouteComponentProps<any>, State> {
  state = {
    hasRecorded: false,
    hasConfirmedTC: false,
  }

  render() {
    return (
      <ConnectedPassphrase
        onRecordedChange={this.handleRecordedChange}
        onConfirmChange={this.handleConfirmChange}
        {...this.state}
      />
    )
  }

  private handleRecordedChange: React.ChangeEventHandler<HTMLInputElement> = ev =>
    this.setState({ hasRecorded: ev.currentTarget.checked })

  private handleConfirmChange: React.ChangeEventHandler<HTMLInputElement> = ev =>
    this.setState({ hasConfirmedTC: ev.currentTarget.checked })
}

export { PassphraseStateful as Passphrase }
