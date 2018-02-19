import * as React from 'react'
import { AppState } from '../app'
import * as swal from 'sweetalert'
import { AppSettingsPresentation } from './AppSettingsPresentation';
export interface Connection {
  horizonServer: string,
  connectionName: string,
  networkPassphrase: string
}

// This should most certainly be part of react state
//
export let defaultConnections: Connection[] = [{
  horizonServer: 'https://stellar-local.abx.com',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Local Development Network'
}, {
  horizonServer: 'https://kinesis-test-net.abx.com',
  networkPassphrase: 'Kinesis Test Network ; February 2018',
  connectionName: 'Kinesis Test Network'
}, {
  horizonServer: 'https://horizon-testnet.stellar.org/',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Stellar Test Network'
}]

export class AppSettings extends React.Component<{appState: AppState, changeConnection: Function}, {horizonServer: string, networkPassphrase: string, connectionName: string}> {
  constructor (props) {
    super(props)
    this.state = {horizonServer: '', networkPassphrase: '', connectionName: ''}
  }

  public async changeHorizonServer(horizonServer: string) {
    this.setState({horizonServer})
  }

  public async changeNetworkPassphrase(networkPassphrase: string) {
    this.setState({networkPassphrase})
  }

  public async changeConnectionName(connectionName: string) {
    this.setState({connectionName})
  }

  public async changeConnection(connection: Connection) {
    this.props.changeConnection(connection)
    await swal('Success', `Connected to ${connection.connectionName}`, 'success')
  }

  public async addConnection(ev) {
    ev.preventDefault()
    if (!this.state.connectionName) {
      await swal('Oops!', 'Please provide a connection name to keep track of what your wallet is currently connected to.', 'error')
      return document.getElementById('settings-connection-name').focus();
    }
    if (!this.state.horizonServer) {
      await swal('Oops!', 'A horizon server endpoint is required to connect to the network.', 'error')
      return document.getElementById('settings-server-address').focus();
    }
    if (!this.state.networkPassphrase) {
      await swal('Oops!', 'A network passphrase is required to connect to the network.', 'error')
      return document.getElementById('settings-network-pass').focus();
    }

    defaultConnections.push({
      horizonServer: this.state.horizonServer,
      networkPassphrase: this.state.networkPassphrase,
      connectionName: this.state.connectionName,
    })
    this.setState({
      horizonServer: '',
      networkPassphrase: '',
      connectionName: '',
    })
  }

  render() {
    return (
      <AppSettingsPresentation
        appState={this.props.appState}
        changeConnectionName={this.changeConnectionName.bind(this)}
        changeConnection={this.changeConnection.bind(this)}
        addConnection={this.addConnection.bind(this)}
        changeNetworkPassphrase={this.changeNetworkPassphrase.bind(this)}
        changeHorizonServer={this.changeHorizonServer.bind(this)}
        horizonServer={this.state.horizonServer}
        networkPassphrase={this.state.networkPassphrase}
        connectionName={this.state.connectionName}
        defaultConnections={defaultConnections}
      />
    )
  }
}
