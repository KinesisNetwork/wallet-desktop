import * as React from 'react'
import { StateChanges } from './CreateWallet'

export interface IProps {
  importWallet: (ev: React.FormEvent<HTMLFormElement>) => void
  handleChange: (ev: React.ChangeEvent<HTMLInputElement>, key: StateChanges) => void
}

export const ImportWallet: React.SFC<IProps> = ({handleChange, importWallet}) => (
  <div>
    <div>
      <span className='icon is-large'>
        <i className='far fa-user' />
      </span>
      <h1 className='sub-heading primary-font'>Import Account</h1>
    </div>
    <form onSubmit={(ev) => importWallet(ev)}>
      <div className='field'>
        <label className='label'>Wallet Name</label>
        <div className='control'>
          <input id='input-account-name' className='input' onChange={(ev) => handleChange(ev, 'accountName')} type='text' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Public Key</label>
        <div className='control'>
          <input id='input-public-key' className='input' onChange={(ev) => handleChange(ev, 'publicKey')} type='text' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Private Key</label>
        <div className='control'>
          <input id='input-private-key' className='input' onChange={(ev) => handleChange(ev, 'privateKey')} type='text' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Wallet Password</label>
        <div className='control'>
          <input id='input-password' className='input' onChange={(ev) => handleChange(ev, 'password')} type='password' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Repeat Wallet Password</label>
        <div className='control'>
          <input id='input-verify-password' className='input' onChange={(ev) => handleChange(ev, 'passwordVerify')} type='password' />
        </div>
      </div>
      <div className='field'>
        <div className='control'>
          <button className='button' type='submit'>Import Account</button>
        </div>
      </div>
    </form>
  </div>
)
