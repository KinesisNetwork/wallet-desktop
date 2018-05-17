import { SidebarSettings, WalletList } from '@containers'
import * as React from 'react'
const logo = require('../logo.svg')

export const Sidebar: React.SFC = () => (
  <div className='vertical-spaced' style={{ backgroundColor: '#2b3e50' }}>
    <img src={logo} className='logo-sidebar' />
    <WalletList />
    <SidebarSettings />
  </div>
)
