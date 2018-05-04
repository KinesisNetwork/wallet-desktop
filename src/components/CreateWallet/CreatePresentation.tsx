import * as React from 'react'

import { GenerateWallet, Props as GenerateWalletProps } from './GenerateWallet'
import { ImportWallet, Props as ImportWalletProps } from './ImportWallet'

export interface Props extends GenerateWalletProps, ImportWalletProps { }

export const CreateAccountPresentation: React.SFC<Props> = (props) => (
  <div>
    <div className='has-text-centered'>
      <h1 className='title-heading primary-font'>Add a new wallet</h1>
    </div>
    <div className='columns has-text-centered'>
      <div className='column is-half'>
        <GenerateWallet {...props} />
      </div>
      <div className='column is-half'>
        <ImportWallet {...props} />
      </div>
    </div>
  </div>
)
