import * as React from 'react'
import { AppState, View } from '../app'
import * as swal from 'sweetalert'
export interface Connection {
  horizonServer: string,
  connectionName: string,
  networkPassphrase: string
}

export const defaultConnections: Connection[] = [{
  horizonServer: 'https://stellar-local.abx.com',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Local Dev'
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

  public async changeConnection(index) {
    this.props.changeConnection('hello', 'there')
  }

  public async addConnection(ev) {
    ev.preventDefault()
    console.log(this.state.horizonServer, this.state.networkPassphrase)
  }

  render() {
    return (
      <div>
        <div className='has-text-centered'>
          <h1 className='title-heading primary-font'>Application Settings</h1>
        </div>
        <div className='columns has-text-centered' style={{marginTop: '35px'}}>
          <div className='column' style={{padding: '25px 60px 60px 70px', borderRight: '1px solid #2b3e50'}}>
            <h1 className='sub-heading primary-font'>Current Network</h1>
          </div>
          <div className='column' style={{padding: '60px', paddingTop: '25px', paddingRight: '80px'}}>
            <i className="far fa-user" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Add New Network</h1>
            <form onSubmit={(ev) => this.addConnection(ev)}>
              <label className='label'>Horizon Server Adress</label>
              <input id='settings-server-address' className='input' onChange={(ev) => this.changeHorizonServer(ev)} type='text' />
              <label className='label'>Network Passphrase</label>
              <input id='settings-network-pass' className='input' onChange={(ev) => this.changeNetworkPassphrase(ev)} type='text' />
              <label className='label'>Connection Name (optional)</label>
              <input id='settings-connection-name' className='input' onChange={(ev) => this.changeNetworkPassphrase(ev)} type='text' />
              <input className='button' value="Add Network" style={{marginTop: '8px', width: '100%'}} type='submit' />
            </form>
          </div>
        </div>
      </div>
    )
  }
}


