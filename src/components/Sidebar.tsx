import * as React from 'react'

import { SidebarPayee } from '@components/SidebarPayee'
import { SidebarSettings } from '@containers/SidebarSettings'
import { WalletList } from '@containers/WalletList'

let logo
if (process.env.IS_WEB) {
  logo = require('../Kinesis_Alpha.svg')
}

export const Sidebar: React.SFC = () => (
  <div className="vertical-spaced" style={{ backgroundColor: '#2b3e50' }}>
    <img src={logo ? logo : './Kinesis_Alpha.svg'} className="logo-sidebar" />
    <WalletList />
    <SidebarPayee />
    <SidebarSettings />
  </div>
)

Sidebar.displayName = 'Sidebar'
