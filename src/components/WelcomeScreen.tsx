import { InputField } from '@components/InputField';
import * as React from 'react'

export interface Props {
  password: string
  hasAccount: boolean
  isPasswordCorrect: boolean
  walletName: string
}

let logo
if (process.env.IS_WEB) {
  logo = require('../logo2.svg')
}

export const WelcomeScreen: React.SFC<Props> = (props) => (
  <div className="container hero" style={{ maxWidth: '540px' }}>
    <header className="has-text-centered" style={{ marginTop: '3.5em' }}>
      <figure>
        <img src={logo} alt="Kinesis logo" />
      </figure>
      <div className="is-uppercase has-text-left" style={{ marginTop: '3.5em' }}>
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
      <div className="has-text-centered">
        <section className="has-text-left level-left" style={{ marginTop: '3.5rem' }}>
          <div className="image is-64x64 has-background-grey level-item" style={{ borderRadius: '100px' }}>
            <span className="is-size-3 has-text-grey-light">{this.getInitials(this.props.walletName)}</span>
          </div>
          <span className="is-size-1 has-text-weight-bold has-text-grey-lighter" style={{ marginLeft: '1rem' }}>{this.props.walletName}</span>
        </section>
        <section style={{ marginTop: '2.5rem' }}>
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
              <div className="control" style={{ marginBottom: '0.25rem' }}>
                <button
                  className="button is-primary is-uppercase has-text-grey-darker"
                  disabled={!this.props.password}
                >Login</button>
              </div>
            </div>
          </form>
          {!this.props.isPasswordCorrect && <p className="is-size-7 has-text-danger">Password is incorrect</p>}
        </section>
        <section style={{ marginTop: '2.5rem' }}>
          <span className="has-text-grey-lighter">Forgot your password?</span>
          <a href="#" className="is-link" style={{ marginLeft: '0.75rem' }}>Restore your wallet</a>
        </section>
      </div>
    )
  }
}

export const NoAccount: React.SFC<any> = () => (
  <div>
    <div className="control has-text-centered" style={{ marginTop: '3.5rem' }}>
      <button className="button is-primary is-uppercase has-text-grey-darker is-large">Begin</button>
    </div>
    <section className="has-text-centered" style={{ marginTop: '2.5rem' }}>
      <span className="has-text-grey-lighter">Already have Kinesis?</span>
      <a href="#" className="is-link" style={{ marginLeft: '0.75rem' }}>Restore an existing wallet</a>
    </section>
    <section className="has-text-centered is-size-7" style={{ marginTop: '2.5rem' }}>
      <span className="has-text-grey-lighter">Why choose Kinesis?</span>
      <a href="#" className="is-link" style={{ marginLeft: '5px' }}>Learn more</a>
    </section>
  </div>
)
