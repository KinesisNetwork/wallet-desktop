import * as React from 'react'

import { SidebarPayee } from '@containers/SidebarPayee'
import { SidebarSettings } from '@containers/SidebarSettings'
import { WalletList } from '@containers/WalletList'

let logo
if (process.env.IS_WEB) {
  logo = require('../logo.svg')
}

export const Sidebar: React.SFC = () => (
  <div className='vertical-spaced' style={{ backgroundColor: '#2b3e50' }}>
    <img src={logo ? logo : './logo.svg'} className='logo-sidebar' />
    <WalletList />
    <SidebarPayee />
    <SidebarSettings />
  </div>
)
