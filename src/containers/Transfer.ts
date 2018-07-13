import { connect } from 'react-redux'

import { changeTransferView } from '@actions'
import { Transfer as TransferPresentation } from '@components/Transfer'
import { RootState } from '@store'

const mapStateToProps = ({ view: { transferView } }: RootState) => ({
  transferView,
})

const mapDispatchToProps = {
  changeTransferView,
}

export const Transfer = connect(mapStateToProps, mapDispatchToProps)(TransferPresentation)
