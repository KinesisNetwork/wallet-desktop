import * as React from 'react'
import { StateChanges } from './CreateWallet'

export interface IProps {
  generate: (ev: React.FormEvent<HTMLFormElement>) => void
  handleChange: (ev: React.ChangeEvent<HTMLInputElement>, key: StateChanges) => void
}

export const GenerateWallet: React.SFC<IProps> = ({generate, handleChange}) => (
  <div>
    <div>
      <span className='icon is-large'>
        <i className='fas fa-user' />
      </span>
      <h1 className='title heading is-4 primary-font'>Generate Account</h1>
    </div>
    <form onSubmit={(ev) => generate(ev)}>
      <div className='field'>
        <label className='label'>Wallet Name</label>
        <div className='control'>
          <input id='generate-name' className='input' onChange={(ev) => handleChange(ev, 'accountName')} type='text' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Wallet Password</label>
        <div className='control'>
          <input id='generate-password' className='input' onChange={(ev) => handleChange(ev, 'password')} type='password' />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Repeat Wallet Password</label>
        <div className='control'>
          <input id='generate-verify-password' className='input' onChange={(ev) => handleChange(ev, 'passwordVerify')} type='password' />
        </div>
      </div>
      <div className='field'>
        <div className='control'>
          <button className='button' type='submit'>Create Account</button>
        </div>
      </div>
    </form>
  </div>
)
