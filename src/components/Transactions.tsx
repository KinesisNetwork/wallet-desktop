import * as React from 'react'
import { AppState } from '../app'
const StellarSdk = require('stellar-sdk')

export class Transactions extends React.Component<{appState: AppState}, {transactions: any[]}> {
  constructor (props) {
    super(props)
    this.state = { transactions: [] }
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))

    const server = new StellarSdk.Server(this.props.appState.serverLocation, {allowHttp: true})

    // TODO: Right a pager
    const pageOne = await server.transactions().forAccount(this.props.appState.publicKey).call()
    const pageTwo = await pageOne.next()

    console.log(StellarSdk.xdr.TransactionResult.fromXDR(pageOne.records[2].result_xdr, 'base64'))
    console.log(StellarSdk.xdr.TransactionMeta.fromXDR(pageOne.records[2].result_meta_xdr, 'base64'))
    console.log(StellarSdk.xdr.TransactionEnvelope.fromXDR(pageOne.records[2].envelope_xdr, 'base64'))

    console.log(pageOne)
    console.log(pageTwo)
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}
