import { changeWalletView } from '@actions'
import { SidebarPayee as SidebarPayeePresentation } from '@components'
import { connect } from 'react-redux'

export const SidebarPayee = connect(() => ({}), { changeWalletView })(SidebarPayeePresentation)
