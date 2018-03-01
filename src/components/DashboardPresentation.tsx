import * as React from 'react'
import { AppState, View } from '../app'
import { Balances } from './Balances'
import { Transfer } from './Transfer'
import { Transactions } from './Transactions'
import { MultiSigTransfer } from './MultiSigTransfer'
import { Password } from './Password';
import { Delete } from './Delete';
import { Loader } from './Loader';

export interface IProps {
  appState: AppState,
  setWalletList: Function,
  changeView: Function,
  setPassword: Function,
  transferInitialised: () => void,
  transferComplete: () => void,
  transfering: boolean,
  tx: Function,
  balances: Function,
  transferView: 'multi' | 'payment',
  updateTransferView: (view: 'multi' | 'payment') => void,
}

export class DashboardPresentation extends React.Component<IProps, {}> {

  private switchTransferView = () => {
    switch(this.props.transferView) {
      case 'payment':
        return (
        <div>
          <Transfer appState={this.props.appState} transferComplete={this.props.transferComplete} transferInitialised={this.props.transferInitialised} />
          <button type='button' className='button' style={{ width: '100%', marginTop: '15px' }} onClick={() => this.props.updateTransferView('multi')} >
            <i className='fa fa-arrow-circle-right fa-lg' style={{ marginRight: '6px' }}></i> Multi-Signature Transfer Management
          </button>
        </div>
        )
      case 'multi':
        return (<MultiSigTransfer
          appState={this.props.appState}
          transactionSubmit={this.props.transferInitialised}
          transactionFinish={this.props.transferComplete}
          updateTransferView={this.props.updateTransferView}
          />)
      default:
        return (<div />)
    }
  }

  render() {
    return (
      <div style={{display: 'table', width: '100%', height: '100%'}}>
        <div className='has-text-centered' style={{display: 'table-row'}}>
          <Password appState={this.props.appState} setPassword={this.props.setPassword} />
        </div>
        <div style={{display: 'table-row'}}>
          <div className='columns' style={{marginTop: '20px'}}>
            <div className='column' style={{padding: '5px 60px 20px 70px', borderRight: '1px solid #2b3e50'}}>
              <Balances ref={this.props.balances} appState={this.props.appState}/>
              <Delete appState={this.props.appState} setWalletList={this.props.setWalletList} changeView={this.props.changeView} />
            </div>
            <div className='column' style={{padding: '5px 70px 20px 60px', position: 'relative'}}>
              <div style={this.props.transfering ? {opacity: 0.3} : {}}>
                { this.switchTransferView(this.props.transferView) }
              </div>
              { this.props.transfering &&
                <div style={{position: 'absolute', zIndex: 10000000, height: '100%', width: '100%', top: '30%', left: '0%' }}>
                  <Loader />
                </div>
              }
            </div>
          </div>
        </div>
        <div style={{paddingLeft: '60px', marginBottom: '15px'}}>
          <h1 className='sub-heading primary-font'>Transactions</h1>
        </div>
        <Transactions ref={this.props.tx} appState={this.props.appState} />
      </div>
    )
  }
}
