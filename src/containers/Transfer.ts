import { transferRequest, updateTransferForm } from '@actions'
import { Transfer  as TransferPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({transfer}: RootState) => ({
  ...transfer.form,
  isTransferring: transfer.isTransferring,
})

export const Transfer = connect(mapStateToProps, {transferRequest, updateTransferForm})(TransferPresentation)
