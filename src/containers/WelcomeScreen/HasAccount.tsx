import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { changeUnlockPasswordInput, unlockWalletRequest } from '@actions'
import { InitialsAvatar } from '@components/InitialsAvatar'
import { InputField } from '@components/InputField'
import { RootState } from '@store'
import { ImageSize, RootRoutes } from '@types'

const mapStateToProps = ({ login, wallet }: RootState) => ({
  walletName: wallet.persisted.walletName,
  passwordError: login.input.unlockFailureText,
  currentPasswordInput: login.input.currentInput,
})

const mapDispatchToProps = {
  changeUnlockPasswordInput,
  unlockWalletRequest,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

class HasAccountPresentation extends React.Component<Props> {
  render() {
    return (
      <main>
        <section className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <InitialsAvatar name={this.props.walletName} size={ImageSize.medium} />
            </div>
            <div className="level-item">
              <div className="is-size-3-mobile is-size-2-tablet is-size-1-desktop has-text-weight-bold has-text-grey-lighter">
                {this.props.walletName}
              </div>
            </div>
          </div>
        </section>
        <section>
          <form
            className="field"
            onSubmit={ev => (ev.preventDefault(), this.props.unlockWalletRequest(new Date()))}
          >
            <label htmlFor="" className="label">
              Password
            </label>
            <InputField
              id="password"
              value={this.props.currentPasswordInput}
              type="password"
              icon="fa-lock-alt"
              button={
                <div className="control">
                  <button className="button is-primary" type="submit">
                    Login
                  </button>
                </div>
              }
              onChangeHandler={this.props.changeUnlockPasswordInput}
              errorText={this.props.passwordError}
            />
          </form>
          <div className="columns">
            <div className="column has-text-right">
              <p>Forgot your password?</p>
            </div>
            <div className="column">
              <Link to={RootRoutes.recover}>Import your wallet</Link>
            </div>
          </div>
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
