import * as React from 'react'
import { AppState } from '../app'
import { Loader } from './Loader'

export class TransferPresentation extends React.Component<{
  appState: AppState,
  transferComplete: Function,
  transferInitialised: Function,
  handleAddress: Function,
  handleAmount: Function,
  handleSubmit: Function,
  handleMemo: Function,
  targetAddress: string,
  transferAmount?: any,
  memo?: string,
  loading: boolean
}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        {
          this.props.loading ? (
            <Loader />
          ) : (
            <div>
              <h1 className='sub-heading primary-font'>Transfer Kinesis</h1>
              <form onSubmit={(ev) => this.props.handleSubmit(ev)}>
                <label className='label'>Target Account</label>
                <input id='transfer-public-key' value={this.props.targetAddress} className='input' onChange={(ev) => this.props.handleAddress(ev)} type='text' />
                <label className='label'>Amount</label>
                <input id='transfer-amount' value={this.props.transferAmount} className='input' onChange={(ev) => this.props.handleAmount(ev)} type='text' />
                <label className='label'>Message (Optional)</label>
                <input id='transfer-memo' value={this.props.memo} className='input' onChange={(ev) => this.props.handleMemo(ev)} type='text' />
                <button type='submit' className='button' style={{marginTop: '8px', width: '100%'}}>
                    <i className='fa fa-arrow-circle-right fa-lg' style={{marginRight: '6px'}} ></i> Transfer
                </button>
              </form>
            </div>
          )
        }
      </div>
    )
  }
}
