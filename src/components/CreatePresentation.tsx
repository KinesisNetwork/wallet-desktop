import * as React from 'react'

import { AppState } from '../app'

export class CreateAccountPresentation extends React.Component<{
  setWalletList: Function,
  setAccountKeys: Function,
  appState: AppState,
  changeView: Function,
  handleSubmit: Function,
  generate: Function,
  handlePublic: Function,
  handlePrivate: Function,
  handleVerifyPassword: Function,
  handlePassword: Function,
}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className='has-text-centered'>
          <h1 className='title-heading primary-font'>Add a new wallet</h1>
        </div>
        <div className='columns has-text-centered' style={{marginTop: '35px'}}>
          <div className='column' style={{padding: '25px 60px 60px 70px', borderRight: '1px solid #2b3e50'}}>
              <i className='fas fa-user' style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Generate Account</h1>
            <form onSubmit={(ev) => this.props.generate(ev)}>
              <label className='label'>Wallet Password</label>
              <input id='generate-password' className='input' onChange={(ev) => this.props.handlePassword(ev)} type='password' />
              <label className='label'>Repeat Wallet Password</label>
              <input id='generate-verify-password' className='input' onChange={(ev) => this.props.handleVerifyPassword(ev)} type='password' />
              <button className='button' type='submit' style={{marginTop: '6px', width: '100%'}}>Create Account</button>
            </form>
          </div>
          <div className='column' style={{padding: '60px', paddingTop: '25px', paddingRight: '80px'}}>
            <i className='far fa-user' style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Import Account</h1>
            <form onSubmit={(ev) => this.props.handleSubmit(ev)}>
              <label className='label'>Public Key</label>
              <input id='input-public-key' className='input' onChange={(ev) => this.props.handlePublic(ev)} type='text' />
              <label className='label'>Private Key</label>
              <input id='input-private-key' className='input' onChange={(ev) => this.props.handlePrivate(ev)} type='text' />
              <label className='label'>Wallet Password</label>
              <input id='input-password' className='input' onChange={(ev) => this.props.handlePassword(ev)} type='password' />
              <label className='label'>Repeat Wallet Password</label>
              <input id='input-verify-password' className='input' onChange={(ev) => this.props.handleVerifyPassword(ev)} type='password' />
              <input className='button' value='Import Account' style={{marginTop: '8px', width: '100%'}} type='submit' />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
