import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { RootRoutes } from '@types'

let logo
if (process.env.IS_WEB) {
  logo = require('../icons/png/64x64.png')
}

export const Sidebar: React.SFC = () => (
  <aside className="sidebar tile is-ancestor vertical-spaced">
    <div className="sidebar-upper tile">
      <div className="tile is-vertical">
        <div className="sidebar-header tile is-parent is-vertical">
          <div className="tile is-child has-text-centered">
            <img src={logo ? logo : './icons/png/64x64.png'} className="sidebar-logo" alt="Logo alpha" />
            <p className="has-text-primary">
              100.00 KINESIS
            </p>
          </div>
          <div className="sidebar-dropdown tile is-child">
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button aria-controls="dropdown-menu" aria-haspopup="true" className="dropdown-button button is-radiusless is-fullwidth">
                  <span className="icon is-large"><i className="fal fa-lg fa-user-circle" /></span>
                  <p>Samuello B</p>
                  <span className="icon is-small"><i className="fal fa-lg fa-angle-down" aria-hidden="true" /></span>
                </button>
              </div>

              <div className="dropdown-menu is-paddingless" id="dropdown-menu" role="menu">
                <div className="dropdown-content is-paddingless">
                  <div className="dropdown-item is-paddingless is-active">
                    <a className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-check-circle" />
                      </span>
                      <span>Account 1</span>
                    </a>
                  </div>
                  <div className="dropdown-item is-paddingless">
                    <a className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon" />
                      <span>Account 2</span>
                    </a>
                  </div>
                  <div className="dropdown-item is-paddingless">
                    <a className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon" />
                      <span>Account 3</span>
                    </a>
                  </div>
                  
                  <hr className="dropdown-divider is-marginless" />
                  
                  <div className="dropdown-item is-paddingless">
                    <a className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-plus-circle" />
                      </span>
                      <span>Add Account</span>
                    </a>
                  </div>
                  
                  <hr className="dropdown-divider is-marginless" />
                  
                  <div className="dropdown-item is-paddingless">
                    <a className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-download" />
                      </span>
                      <span>Import Account</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sidebar-list tile is-parent is-vertical">
          <SidebarItem title="Portfolio" to={RootRoutes.dashboard} icon="chart-pie" />
          <SidebarItem title="Funds" to="/funds" icon="wallet" />
          <SidebarItem title="Address Book" to={RootRoutes.addressBook} icon="address-book" />
          <SidebarItem title="Exchange" to="/exchange" icon="exchange" />
        </div>
      
      </div>
    </div>
    <div className="sidebar-lower tile is-parent">
      <div className="sidebar-lower-icon-list tile is-child">
        <a className="sidebar-lower-icon button is-shadowless" href="#" title="settings">
          <span className="icon is-large">
            <i className="fal fa-lg fa-sliders-v" />
          </span>
        </a>
        <a className="sidebar-lower-icon button is-shadowless" href="#" title="help">
          <span className="icon is-large">
            <i className="fal fa-lg fa-question-circle" />
          </span>
        </a>
        <a className="sidebar-lower-icon button is-shadowless" href="/" title="logout">
          <span className="icon is-large">
            <i className="fal fa-lg fa-sign-out-alt" />
          </span>
        </a>
      </div>
    </div>
  </aside>
)

const SidebarItem: React.SFC<{ title: string, to: string, icon: string }> = ({ icon, title, to }) => (
  <div className="sidebar-item tile is-child">
    <NavLink activeClassName="is-active" className="button is-radiusless is-fullwidth is-shadowless" to={to}>
      <div className="icon is-medium">
        <i className={`fal fa-lg fa-${icon}`} />
      </div>
      <div>{title}</div>
    </NavLink>
  </div>

)