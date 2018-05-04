import * as React from 'react'
import swal from 'sweetalert'
import { Keypair } from 'js-kinesis-sdk'

import {
  Wallet,
  View,
  ViewParams,
} from '@types'
import { AppState } from '../../app'
import { addNewWallet } from '@services/wallets'
import { encryptPrivateKey } from '@services/encryption'
import { CreateAccountPresentation } from './CreatePresentation';

export interface Props {
  setWalletList: (wallets: Wallet[]) => void
  appState: AppState
  changeView: (view: View, options: ViewParams) => void
}

export interface State {
  accountName: string
  privateKey: string
  publicKey: string
  password: string
  passwordVerify: string
}

export type StateChanges = keyof State

export class CreateWallet extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      accountName: '',
      privateKey: '',
      publicKey: '',
      password: '',
      passwordVerify: '',
    }
  }

  private addNewWallet = async (publicKey: string, privateKey: string, password: string, accountName: string) => {
    let encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    try {
      const walletList = await addNewWallet({publicKey, encryptedPrivateKey, accountName})
      this.props.setWalletList(walletList)
      this.props.changeView(View.dashboard, {walletIndex: 0})
    } catch (err) {
      console.error(err)
      swal('Something went wrong', err.message, 'error')
    }
  }

  public generate = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'generate')
    if (validPassword) {
      const accountKeys = Keypair.random()
      const [accountKey, privateKey] = [accountKeys.publicKey(), accountKeys.secret()]
      this.addNewWallet(accountKey, privateKey, this.state.password, this.state.accountName)
    }
  }

  public importWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!this.state.publicKey) {
      await swal('Oops!', 'A public key is required to import an account', 'error')
      this.focus('import-public-key')
    }
    if (!this.state.privateKey) {
      await swal('Oops!', 'A private key is required to import an account', 'error')
      this.focus('import-private-key')
    }
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'import')
    if (validPassword) {
      this.addNewWallet(this.state.publicKey, this.state.privateKey, this.state.password, this.state.accountName)
    }
  }

  private verifyPassword = async (password: string, passwordVerify: string, accountType: 'generate' | 'import'): Promise<boolean> => {
    if (!password) {
      await swal('Oops!', 'Wallet password is required', 'error')
      this.focus(`${accountType}-password`)
      return false
    }
    if (password !== passwordVerify) {
      await swal('Oops!', 'The verification password does not match the provided password', 'error')
      this.focus(`${accountType}-verify-password`)
      return false
    }
    return true
  }

  public handleChange = (ev: React.ChangeEvent<HTMLInputElement>, key: StateChanges) => {
    this.setState({[key as any]: ev.target.value})
  }

  private focus = (id: string): void => {
    const element = document.getElementById(id)
    if (element) {
      element.focus()
    }
  }

  render() {
    return (
      <CreateAccountPresentation
        generate={this.generate}
        importWallet={this.importWallet}
        handleChange={this.handleChange}
      />
    )
  }
}
