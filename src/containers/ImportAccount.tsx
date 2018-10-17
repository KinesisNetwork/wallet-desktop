import { importAccountFromSecret, showNotification } from '@actions'
import { InputField } from '@components/InputField'
import { isValidSecret } from '@services/kinesis'
import { RootRoutes } from '@types'
import { push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const mapDispatchToProps = { showNotification, importAccountFromSecret, push }

type Props = typeof mapDispatchToProps

export class ImportAccountPresentation extends React.Component<
  Props,
  { privateKey: string; canSubmit: boolean; invalidPrivateKey: boolean }
> {
  public state = { privateKey: '', canSubmit: false, invalidPrivateKey: false }
  public onChange = val => {
    if (!isValidSecret(val)) {
      this.setState({ privateKey: val, canSubmit: false, invalidPrivateKey: true })
      return
    }

    this.setState({ privateKey: val, canSubmit: true, invalidPrivateKey: false })
  }

  public onSubmit = ev => {
    ev.preventDefault()
    this.props.importAccountFromSecret({ secret: this.state.privateKey })
  }

  public render() {
    return (
      <React.Fragment>
        <h1 className="title has-text-centered" style={{ marginBottom: '5px' }}>
          <span className="icon">
            <i className="fal fa-lg fa-download" />
          </span>
        </h1>
        <h1 className="title has-text-centered is-uppercase">Import Account</h1>
        <div className="content">
          <p>
            Imported accounts are not associated with your wallet's recovery phrase. If you import
            the wallet, you will need to re-import this account.
          </p>
          <p>
            Instead, we recommend that you transfer the funds to an existing account in this wallet.
            That way all of your funds are associated with your recovery phrase.
          </p>
        </div>
        <form
          onSubmit={this.onSubmit}
          style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '30px' }}
        >
          <InputField
            id="import-private-key"
            label="Private Key"
            icon="fa-user-circle"
            value={this.state.privateKey}
            onChangeHandler={this.onChange}
            placeholder="Private Key"
            autoFocus={true}
            maxLength={56}
            minLength={1}
            errorText={this.state.invalidPrivateKey ? 'Invalid private key' : ''}
          />
          <div className="control">
            <div className="buttons is-right">
              <Link to={RootRoutes.dashboard} className="button">
                Cancel
              </Link>
              <button type="submit" className="button is-primary" disabled={!this.state.canSubmit}>
                <span className="icon">
                  <i className="fal fa-download" />
                </span>
                <span>Import</span>
              </button>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export const ImportAccount = connect(
  () => ({}),
  mapDispatchToProps,
)(ImportAccountPresentation)
