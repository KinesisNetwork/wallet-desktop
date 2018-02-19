import * as React from 'react'
import { AppState } from '../app'
import * as swal from 'sweetalert'
import { Connection } from './AppSettings';
export class AppSettingsPresentation extends React.Component<{
  appState: AppState,
  changeConnection: Function,
  changeConnectionName: Function,
  horizonServer: string,
  networkPassphrase: string,
  connectionName: string
  changeHorizonServer: Function,
  changeNetworkPassphrase: Function,
  defaultConnections: Connection[],
  addConnection: Function
}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className='has-text-centered'>
          <h1 className='title-heading primary-font'>Application Settings</h1>
        </div>
        <div className='columns has-text-centered' style={{marginTop: '35px'}}>
          <div className='column' style={{padding: '25px 60px 60px 70px', borderRight: '1px solid #2b3e50'}}>
            <h1 className='sub-heading primary-font'>Select Network</h1>
            {
              this.props.defaultConnections.map((connection: Connection, index: number) => {
                let activeNetwork = connection === this.props.appState.connection
                let activeClass = activeNetwork ? 'is-focused' : ''
                return (
                  <div key={index} style={{marginTop: '5px'}}>
                    <button onClick={() => {this.props.changeConnection(connection)}} className={'button ' + activeClass} style={{fontFamily: 'Fira Mono', fontSize: '12px', display: 'block', height: 'auto',  margin: 'auto', width: '100%'}}>
                      {connection.connectionName} <br /> {connection.horizonServer} <br /> {connection.networkPassphrase}
                    </button>
                  </div>
                )
              })
            }
          </div>
          <div className='column' style={{padding: '60px', paddingTop: '25px', paddingRight: '80px'}}>
            <i className="fas fa-globe" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Add New Network</h1>
            <form onSubmit={(ev) => this.props.addConnection(ev)}>
              <label className='label'>Connection Name</label>
              <input id='settings-connection-name' value={this.props.connectionName} className='input' onChange={(ev) => this.props.changeConnectionName(ev.target.value)} type='text' />
              <label className='label'>Horizon Server Adress</label>
              <input id='settings-server-address' value={this.props.horizonServer} className='input' onChange={(ev) => this.props.changeHorizonServer(ev.target.value)} type='text' />
              <label className='label'>Network Passphrase</label>
              <input id='settings-network-pass' value={this.props.networkPassphrase} className='input' onChange={(ev) => this.props.changeNetworkPassphrase(ev.target.value)} type='text' />
              <input className='button' value="Add Network" style={{marginTop: '8px', width: '100%'}} type='submit' />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
