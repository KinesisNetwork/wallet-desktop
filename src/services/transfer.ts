import {
  Keypair,
} from 'js-kinesis-sdk'

import {
  KinesisBlockchainGatewayFactory,
} from '@abx/js-kinesis-sdk-v2'

import { HorizonError, WalletLockError } from '@helpers/errors'
import { Connection, TransferRequest } from '@types'
import { getAccountIfExists, getFactoryParams } from './accounts'
import { getFeeInStroops, getServer } from './kinesis'

export async function createKinesisTransfer(
  decryptedPrivateKey: string,
  connection: Connection,
  request: TransferRequest,
): Promise<string> {
  if (!decryptedPrivateKey) {
    throw new WalletLockError()
  }
  const result = getFactoryParams(connection)
  const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)
  console.log(result.coin, result.environment, "ppppppppppppppppppppppp")
  const sourceKey = Keypair.fromSecret(decryptedPrivateKey)
  console.log("transaction---------------------------------")
  const sequence = await blockchainGateway.getNextSequenceNumberForAccount(sourceKey.publicKey())
  console.log("sequence--------------------------------", sequence)
  const unsignedTxEnvelop = await blockchainGateway.createTransactionEnvelopeWithSequenceNumber({
    senderAddress: sourceKey.publicKey(),
    sequenceNumber: sequence,
    toAddress: request.targetPayee,
    memo: request.memo || '',
    amount: request.amount
  })
  return blockchainGateway.signTransactionEnvelope(unsignedTxEnvelop, decryptedPrivateKey)
}

export async function submitSignedTransaction(connection: Connection, txHash: string) {
  const result = getFactoryParams(connection)
  console.log(result.coin, result.environment, "submitSignedTransaction called!!")
  const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)
  try {
    return blockchainGateway.submitSignedTransactionEnvelope(txHash)
  } catch {
    return new HorizonError('Unknown result from Horizon. Check your transaction list.')
  }
}

// function transactionWithTimeout(transactionSubmit: Promise<any>, ms: number) {
//   const rejectOnTimeout = new Promise((_, reject) => {
//     const timeout = setTimeout(() => {
//       clearTimeout(timeout)
//       reject(new HorizonError('Unknown result from Horizon. Check your transaction list.'))
//     }, ms)
//   })

//   return Promise.race([transactionSubmit, rejectOnTimeout])
// }

export async function generateTransferTransaction(
  sourcePublicKey: string,
  connection: Connection,
  request: TransferRequest,
): Promise<string> {
  const result = getFactoryParams(connection)
  const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)
  const sequence = await blockchainGateway.getNextSequenceNumberForAccount(sourcePublicKey)
  return await blockchainGateway.createTransactionEnvelopeWithSequenceNumber({
    senderAddress: sourcePublicKey,
    sequenceNumber: sequence,
    toAddress: request.targetPayee,
    memo: request.memo || '',
    amount: request.amount
  })
}

// async function newTransferTransaction(
//   connection: Connection,
//   sourcePublicKey: string,
//   request: TransferRequest
// ): Promise<string> {
//   const result = getFactoryParams(connection)
//   const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)
//   const sequence = await blockchainGateway.getNextSequenceNumberForAccount(sourcePublicKey)
//   return await blockchainGateway.createTransactionEnvelopeWithSequenceNumber({
//     senderAddress: sourcePublicKey,
//     sequenceNumber: sequence,
//     toAddress: request.targetPayee,
//     memo: request.memo || '',
//     amount: request.amount
//   })
// }

// async function newPaymentTransferTransaction(
//   connection: Connection,
//   sourcePublicKey: string,
//   { amount, targetPayee: destination, memo }: TransferRequest,
// ): Promise<string> {
//   const result = getFactoryParams(connection)
//   const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)
//   const sequence = await blockchainGateway.getNextSequenceNumberForAccount(sourcePublicKey)
//   return await blockchainGateway.createTransactionEnvelopeWithSequenceNumber({
//     senderAddress: sourcePublicKey,
//     sequenceNumber: sequence,
//     toAddress: destination,
//     memo: memo || '',
//     amount: Number(amount)
//   })
// }

// async function newCreateAccountTransaction(
//   connection: Connection,
//   sourcePublicKey: string,
//   { amount, targetPayee: destination, memo }: TransferRequest,
// ): Promise<string> {
//   const result = getFactoryParams(connection)
//   const blockchainGateway = new KinesisBlockchainGatewayFactory().getGatewayInstance(result.coin, result.environment)

//   return ''
// }
