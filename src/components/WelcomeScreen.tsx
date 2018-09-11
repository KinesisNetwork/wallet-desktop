import { InputField } from '@components/InputField';
import * as React from 'react'

export interface Props {
  hasAccount: boolean
  isPasswordCorrect: boolean
  walletName: string
}

let logo
if (process.env.IS_WEB) {
  logo = require('../logo2.svg')
}

export const WelcomeScreen: React.SFC<Props> = (props) => (
  <div className="container u-padding-left-sm-2 u-padding-right-sm-2" style={{ maxWidth: '540px' }}>
    <header className="u-margin-top-xl vertical-spaced level">
      <figure>
        <img src={logo} alt="Kinesis logo" />
      </figure>
      <div className="heading u-margin-top-xl">
        <h2 className="is-size-3 has-text-weight-semibold has-text-grey-lighter">Welcome to the</h2>
        <h1 className="is-size-1 has-text-weight-bold has-text-primary">future of money</h1>
      </div>
    </header>
    {props.hasAccount ? <HasAccount {...props} /> : <NoAccount />}
  </div >
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
      <div>
        <section className="level-left u-margin-top-xl">
          <div className="image is-64x64 has-background-grey level-item is-marginless" style={{ borderRadius: '100px' }}>
            <span className="is-size-3 has-text-grey-light">{this.getInitials(this.props.walletName)}</span>
          </div>
          <div className="is-size-1 has-text-weight-bold has-text-grey-lighter u-margin-left-md-1">{this.props.walletName}</div>
        </section>
        <section className="u-margin-top-lg-1">
          <form>
            <div className="field is-grouped" style={{ alignItems: 'flex-end' }}>
              <InputField
                id="password"
                value=""
                label="Password"
                hasButton={true}
                onChangeHandler={newValue => newValue}
                isPasswordCorrect={this.props.isPasswordCorrect}
              />
              <div className="control u-margin-bottom-xxs">
                <button
                  className="button is-primary is-uppercase has-text-grey-darker"
                >Login</button>
              </div>
            </div>
          </form>
          {!this.props.isPasswordCorrect && <p className="is-size-7 has-text-danger">Password is incorrect</p>}
        </section>
        <section className="has-text-centered u-margin-top-lg-1">
          <span className="has-text-grey-lighter">Forgot your password?</span>
          <a href="#" className="is-link u-margin-left-sm-1">Restore your wallet</a>
        </section>
      </div>
    )
  }
}

export const NoAccount: React.SFC<any> = () => (
  <div className="vertical-spaced level u-margin-top-md-2">
    <div className="control">
      <button className="button is-primary is-uppercase has-text-grey-darker is-large">Begin</button>
    </div>
    <section className="u-margin-top-lg-1">
      <span className="has-text-grey-lighter">Already have Kinesis?</span>
      <a href="#" className="is-link u-margin-left-sm-1">Restore an existing wallet</a>
    </section>
    <section className="is-size-7 u-margin-top-lg-1">
      <span className="has-text-grey-lighter">Why choose Kinesis?</span>
      <a href="#" className="is-link u-margin-left-xxs">Learn more</a>
    </section>
  </div>
)
