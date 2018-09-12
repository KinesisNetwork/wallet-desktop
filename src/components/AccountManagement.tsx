import { Sign } from '@containers/Sign'
import * as React from 'react'

const AccountManagement: React.SFC<any> = () =>
  <div className='section'>
    <div className='container'>
      <div className='card' style={{borderRadius: '5px'}}>
        <div className='card-content'>
          <div className='has-text-centered'>
            <p className='title'>Account 1</p>
            <div style={{position: 'relative'}}>
              <a className='button is-primary is-outlined'>
                GC5AIC4OGSVKYOERINIIDXVYMC5KZPNLA65BPZVOFEBFG4CBAIDHG353
                &nbsp;
                <i className='far fa-copy' />
              </a>
              <button className='button' style={{position: 'absolute', right: 0}}>
                <span>Advanced</span>
                <span className='icon is-small'>
                  <i className='fas fa-angle-down' aria-hidden='true' />
                </span>
              </button>
            </div>
          </div>
          <Sign />
        </div>
      </div>
    </div>
  </div>

export { AccountManagement }
