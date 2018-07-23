import { showCopyAlert } from '@helpers/textAlerts'
import { AccountResponse, Transaction } from 'js-kinesis-sdk'

export function isPaymentMultiSig(account: AccountResponse): boolean {
  const paymentWeight = account.thresholds.med_threshold
  const masterSigner = account.signers.find(signer => signer.public_key === account.accountId())
  const masterWeight = (masterSigner && masterSigner.weight) || 1
  return paymentWeight > masterWeight
}

export async function showMultiSigTransaction(transaction: Transaction): Promise<any> {
  const serializedTransaction = transaction
    .toEnvelope()
    .toXDR()
    .toString('base64')
  return showCopyAlert(
    `
    Your account requires multiple signatures for this transaction.
    Clicking Copy will copy the transaction information to send to your multisig signers.
    `,
    serializedTransaction,
  )
}
