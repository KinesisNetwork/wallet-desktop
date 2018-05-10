import { SidebarSettings, WalletList } from '@containers'
import * as React from 'react'

export const Sidebar: React.SFC = () => (
  <div className='vertical-spaced' style={{ backgroundColor: '#2b3e50' }}>
    <img src='./logo.svg' className='logo-sidebar' />
    <WalletList />
    <SidebarSettings />
  </div>
)
