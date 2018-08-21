export function isPaymentMultiSig(account: any): boolean {
  const paymentWeight = account.thresholds.med_threshold
  const masterSigner = account.signers.find((signer: any) => signer.public_key === account.accountId())
  const masterWeight = masterSigner && masterSigner.weight || 1
  return paymentWeight > masterWeight
}

