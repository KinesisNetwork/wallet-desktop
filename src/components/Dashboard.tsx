import * as React from 'react'
import { AppState, View } from '../app'
const StellarBase = require('stellar-sdk')

export class Dashboard extends React.Component<{appState: AppState, changeView: Function}, undefined> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        <p>Public Key: {this.props.appState && this.props.appState.publicKey}</p>
        <p>Private Key: {this.props.appState.privateKey}</p>
      </div>
    )
  }
}
