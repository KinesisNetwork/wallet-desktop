import { transferRequest, updateTransferForm } from '@actions'
import { Transfer  as TransferPresentation } from '@components'
import { getFeeInKinesis } from '@services/kinesis'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ connections, transfer }: RootState) => ({
  ...transfer.form,
  getFee: (amount: number) => getFeeInKinesis(connections.currentConnection, amount),
  isTransferring: transfer.isTransferring,
})

const mapDispatchToProps = {
  transferRequest,
  updateTransferForm,
}

export type TransferProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
export const Transfer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPresentation)
