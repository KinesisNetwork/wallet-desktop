import { changeTransferView } from '@actions'
import { Transfer as TransferPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ view: { transferView } }: RootState) => ({
  transferView,
})

const mapDispatchToProps = {
  changeTransferView,
}

export const Transfer = connect(mapStateToProps, mapDispatchToProps)(TransferPresentation)
