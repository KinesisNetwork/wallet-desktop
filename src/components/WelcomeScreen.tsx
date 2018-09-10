import { InputField } from '@components/InputField';
import * as React from 'react'

// tslint:disable-next-line:no-empty-interface
export interface Props { }

let logo
let avatar
if (process.env.IS_WEB) {
  logo = require('../logo2.svg')
  avatar = require('../Avatar.svg')
}

export const WelcomeScreen: React.SFC<Props> = () => (
  <div className="container" style={{ maxWidth: '540px' }}>
    <header className="has-text-centered" style={{ marginTop: '3.5em' }}>
      <figure>
        <img src={logo} alt="Kinesis logo" />
      </figure>
      <div className="is-uppercase has-text-left" style={{ marginTop: '3.5em' }}>
        <h2 className="is-size-3 has-text-weight-semibold has-text-grey-lighter">Welcome to the</h2>
        <h1 className="is-size-1 has-text-weight-bold has-text-primary">future of money</h1>
      </div>
    </header>
    <section className="has-text-left level-left" style={{ marginTop: '3.5em' }}>
      <figure className="image is-64x64 is-inline-block">
        <img src={avatar} alt="User avatar" className="is-rounded" />
      </figure>
      <span className="is-size-1 has-text-weight-bold has-text-grey-lighter" style={{ marginLeft: '1em' }}>
        Sam B
      </span>
    </section>
    <section style={{ marginTop: '2.5em' }}>
      <form>
        <div className="field is-grouped" style={{ alignItems: 'flex-end' }}>
          <InputField
            id="password"
            value=""
            label="Password"
            hasButton={true}
            onChangeHandler={newValue => console.log(newValue)}
            icon={{ type: 'fa-eye', colour: 'primary', position: 'right' }}
          />
          <div className="control" style={{ marginBottom: '0.25rem' }}>
            <button className="button is-primary is-uppercase has-text-grey-darker">Login</button>
          </div>
        </div>
      </form>
    </section>
    <section className="has-text-centered" style={{ marginTop: '2.5em' }}>
      <span className="has-text-grey-lighter">Forgot your password?</span>
      <a href="#" className="is-link" style={{ marginLeft: '1.5rem' }}>Restore your wallet</a>
    </section>
  </div >
)
