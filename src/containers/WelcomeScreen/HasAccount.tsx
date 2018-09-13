import * as React from 'react'
import { connect } from 'react-redux'

import { changeUnlockPasswordInput, unlockWalletRequest } from '@actions'
import { InputField } from '@components/InputField'
import { RootState } from '@store'

const mapStateToProps = (state: RootState) => ({
  walletName: state.wallet.persisted.walletName,
  passwordError: state.passwords.unlockFailureText,
  currentPasswordInput: state.passwords.currentInput,
})

const mapDispatchToProps = {
  changeUnlockPasswordInput,
  unlockWalletRequest,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

class HasAccountPresentation extends React.Component<Props> {
  getInitials(walletName: string): string {
    const [firstName, surName] = walletName.split(' ')
    const firstInitial = firstName.charAt(0)
    const secondInitial = surName ? surName.charAt(0) : ''
    return `${firstInitial}${secondInitial}`.toUpperCase()
  }
  render() {
    return (
      <main>
        <section className="level is-mobile u-margin-bottom-lg-1">
          <div className="level-left">
            <div
              className="image is-64x64 has-background-grey level-item"
              style={{ borderRadius: '100px' }}
            >
              <span className="is-size-3 has-text-grey-light">
                {this.getInitials(this.props.walletName)}
              </span>
            </div>
            <div className="is-size-3-mobile is-size-2-tablet is-size-1-desktop has-text-weight-bold has-text-grey-lighter u-margin-left-sm-1">
              {this.props.walletName}
            </div>
          </div>
        </section>
        <section className="u-margin-bottom-lg-2">
          <form
            className="field is-grouped"
            style={{ alignItems: 'flex-end' }}
            onSubmit={ev => (ev.preventDefault(), this.props.unlockWalletRequest(new Date()))}
          >
            <InputField
              id="password"
              value={this.props.currentPasswordInput}
              type="password"
              label="Password"
              hasButton={true}
              onChangeHandler={this.props.changeUnlockPasswordInput}
              errorText={this.props.passwordError}
            />
            <div className="control u-margin-bottom-xxs">
              <button className="button is-primary is-uppercase has-text-grey-darker" type="submit">
                Login
              </button>
            </div>
          </form>
        </section>
        <section className="has-text-centered">
          <span className="has-text-grey-lighter">Forgot your password?</span>
          <a href="#" className="is-link u-margin-left-sm-1">
            Restore your wallet
          </a>
        </section>
      </main>
    )
  }
}

const ConnectedHasAccount = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HasAccountPresentation)

export { ConnectedHasAccount as HasAccount }
