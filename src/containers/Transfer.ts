import { connect } from 'react-redux'
import { Transfer  as TransferPresentation } from '@components'
import { RootState } from '@store';
import { updateTransferForm, transferRequest } from '@actions';

const mapStateToProps = ({transfer}: RootState) => ({
  ...transfer.form,
  isTransferring: transfer.isTransferring,
})

export const Transfer = connect(mapStateToProps, {transferRequest, updateTransferForm})(TransferPresentation)
