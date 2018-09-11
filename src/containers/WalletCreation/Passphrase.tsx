import { goBack as goBackAction } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@store'

const mapStateToProps = (state: RootState) => ({
  passphrase: state.wallet.create.passphrase,
})

const mapDispatchToProps = {
  goBack: goBackAction,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

type StatefulProps = State & { onConfirmChange: React.ChangeEventHandler<HTMLInputElement> }

const PassphrasePresentation: React.SFC<Props & StatefulProps> = ({
  passphrase,
  goBack,
  hasConfirmed,
  onConfirmChange,
}) => (
  <React.Fragment>
    <h1 className="title has-text-primary has-text-centered">Record your paper key</h1>
    <div className="content">
      <p>
        Your paper key (seed phrase/mnemonic) is the only way to regain access to your wallet if you
        forget the password or lose access to this device.
      </p>
      <p>
        <strong>Anyone with your paper key will have complete access to your wallet.</strong>
        <br />
        <strong>Write down and save these 12 words:</strong>
      </p>
    </div>
    <div className="field">
      <label className="label">Your paper key</label>
      <div className="control">
        <textarea
          className="textarea is-static is-large"
          readOnly={true}
          value={passphrase}
          style={{ resize: 'none' }}
        />
        <p className="help">Your paper key is not case sensitive</p>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <input
          className="is-checkradio"
          id="has-copied"
          type="checkbox"
          name="has-copied"
          checked={hasConfirmed}
          onChange={onConfirmChange}
        />
        <label htmlFor="has-copied">
          I confirm I have recorded my paper key and stored it in a safe place
        </label>
      </div>
    </div>
    <div className="field is-grouped is-grouped-right">
      <div className="control">
        <button type="button" className="button is-text" onClick={goBack}>
          Back
        </button>
      </div>
      <div className="control">
        <button className="button is-success" disabled={!hasConfirmed}>
          Continue
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
  hasConfirmed: boolean
}

class PassphraseStateful extends React.Component<Props, State> {
  state = {
    hasConfirmed: false,
  }

  render() {
    return (
      <ConnectedPassphrase
        hasConfirmed={this.state.hasConfirmed}
        onConfirmChange={this.handleConfirm}
      />
    )
  }

  private handleConfirm: React.ChangeEventHandler<HTMLInputElement> = ev => {
    this.setState({ hasConfirmed: ev.currentTarget.checked })
  }
}

export { PassphraseStateful as Passphrase }
