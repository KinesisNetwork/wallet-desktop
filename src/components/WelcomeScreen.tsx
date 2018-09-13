import { InputField } from '@components/InputField'
import * as React from 'react'

export interface Props {
  hasAccount: boolean
  isIncorrectPassword: boolean
  walletName: string
}

let logo
if (process.env.IS_WEB) {
  logo = require('../logo2.svg')
}

export const WelcomeScreen: React.SFC<Props> = props => (
  <div className="section">
    <div className="container">
      <div className="columns is-mobile is-centered">
        <div className="column is-two-fifths-fullhd is-half-desktop is-three-fifths-tablet is-four-fifths-mobile">
          <header className="u-margin-bottom-lg-1">
            <div className="vertical-spaced level is-mobile">
              <figure className="has-text-centered u-margin-bottom-xl">
                <img
                  src={logo ? logo : './logo2.svg'}
                  alt="Kinesis logo"
                  style={{ maxWidth: '60%' }}
                />
              </figure>
              <div className="heading">
                <h2 className="is-size-5-mobile is-size-4-tablet is-size-2-desktop has-text-weight-semibold has-text-grey-lighter">
                  Welcome to the
                </h2>
                <h1 className="is-size-3-mobile is-size-2-tablet is-size-1-desktop has-text-weight-bold has-text-primary">
                  future of money
                </h1>
              </div>
            </div>
          </header>
          {props.hasAccount ? <HasAccount {...props} /> : <NoAccount />}
        </div>
      </div>
    </div>
  </div>
)

export class HasAccount extends React.Component<Props> {
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
          <form className="field is-grouped" style={{ alignItems: 'flex-end' }}>
            <InputField
              id="password"
              value=""
              label="Password"
              hasButton={true}
              onChangeHandler={newValue => newValue}
              errorText={this.props.isIncorrectPassword ? 'Password is incorrect' : ''}
            />
            <div className="control u-margin-bottom-xxs">
              <button className="button is-primary is-uppercase has-text-grey-darker">Login</button>
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

export const NoAccount: React.SFC<any> = () => (
  <main className="has-text-centered">
    <div className="u-margin-bottom-lg-2">
      <button className="button is-primary is-uppercase has-text-grey-darker is-large">
        Begin
      </button>
    </div>
    <section className="u-margin-bottom-sm-2">
      <span className="has-text-grey-lighter">Already have Kinesis?</span>
      <a href="#" className="is-link u-margin-left-sm-1">
        Restore an existing wallet
      </a>
    </section>
    <section className="is-size-7">
      <span className="has-text-grey-lighter">Why choose Kinesis?</span>
      <a href="#" className="is-link u-margin-left-xxs">
        Learn more
      </a>
    </section>
  </main>
)
