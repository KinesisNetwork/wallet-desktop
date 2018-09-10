import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => ({
  passphrase: state.wallet.create.passphrase,
})

type Props = ReturnType<typeof mapStateToProps>

const PassphrasePresentation: React.SFC<Props> = ({ passphrase }) => (
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
        <textarea className="textarea is-static is-large" readOnly={true} value={passphrase} />
        <p className="help">Your paper key is not case sensitive</p>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <input className="is-checkradio" id="has-copied" type="checkbox" name="has-copied" />
        <label htmlFor="has-copied">
          I confirm I have recorded my paper key and stored it in a safe place
        </label>
      </div>
    </div>
    <div className="field is-grouped is-grouped-right">
      <div className="control">
        <button type="button" className="button is-text">
          Back
        </button>
      </div>
      <div className="control">
        <button className="button is-success">Continue</button>
      </div>
    </div>
  </React.Fragment>
)

export const Passphrase = connect(mapStateToProps)(PassphrasePresentation)

export { PassphrasePresentation }
