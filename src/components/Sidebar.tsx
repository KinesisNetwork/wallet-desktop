import * as React from 'react'

let logo
if (process.env.IS_WEB) {
  logo = require('../Kinesis_Alpha.svg')
}

export const Sidebar: React.SFC = () => (
  <aside className="sidebar tile is-ancestor vertical-spaced">
    <div className="sidebar-upper tile">
      <div className="tile is-vertical">
        <div className="sidebar-heading tile is-parent is-vertical">
          <div className="tile is-child">
            <img src={logo ? logo : './Kinesis_Alpha.svg'} className="sidebar-logo" alt="Logo alpha" />
            <p className="has-text-primary has-text-centered">
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
                    <span className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-check-circle" />
                      </span>
                      <span>Account 1</span>
                    </span>
                  </div>
                  <div className="dropdown-item is-paddingless is-active">
                    <span className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon" />
                      <span>Account 2</span>
                    </span>
                  </div>
                  <div className="dropdown-item is-paddingless">
                    <span className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon" />
                      <span>Account 3</span>
                    </span>
                  </div>
                  
                  <hr className="dropdown-divider is-marginless" />
                  
                  <div className="dropdown-item is-paddingless">
                    <span className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-plus-circle" />
                      </span>
                      <span>Add Account</span>
                    </span>
                  </div>
                  
                  <hr className="dropdown-divider is-marginless" />
                  
                  <div className="dropdown-item is-paddingless">
                    <span className="button is-radiusless is-fullwidth is-shadowless">
                      <span className="icon">
                        <i className="fal fa-lg fa-download" />
                      </span>
                      <span>Import Account</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sidebar-list tile is-parent is-vertical">
          <div className="sidebar-item tile is-child">
            <a className="button is-radiusless is-fullwidth is-shadowless is-active" href="/portfolio">
              <div className="icon is-medium">
                <i className="fal fa-lg fa-chart-pie" />
              </div>
              <div>Portfolio</div>
            </a>
          </div>

          <div className="sidebar-item tile is-child">
            <a className="button is-radiusless is-fullwidth is-shadowless" href="/funds">
              <span className="icon is-medium">
                <i className="fal fa-lg fa-wallet" />
              </span>
              <span>Funds</span>
            </a>
          </div>

          <div className="sidebar-item tile is-child">
            <a className="button is-radiusless is-fullwidth is-shadowless" href="/address-book">
              <span className="icon is-medium">
                <i className="fal fa-lg fa-address-book" />
              </span>
              <span>Address Book</span>
            </a>
          </div>

          <div className="sidebar-item tile is-child">
            <a className="button is-radiusless is-fullwidth is-shadowless" href="/exchange">
              <span className="icon is-medium">
                <i className="fal fa-lg fa-exchange" />
              </span>
              <span>Exchange</span>
            </a>
          </div>
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

Sidebar.displayName = 'Sidebar'
