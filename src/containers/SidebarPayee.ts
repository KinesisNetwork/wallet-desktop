import { connect } from 'react-redux'

import { changeWalletView } from '@actions'
import { SidebarPayee as SidebarPayeePresentation } from '@components/SidebarPayee'

const EMPTY = {}

export const SidebarPayee = connect(() => EMPTY, { changeWalletView })(SidebarPayeePresentation)
