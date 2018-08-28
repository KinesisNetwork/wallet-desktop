import * as React from 'react'

import { LabelledField } from '@components/LabelledField'
import { Payee } from '@types'

type RemovePayee = (payeeName: string) => any
export interface Props {
  payees: Payee[]
  removePayee: RemovePayee
}

export const DeletePayeeLink: React.SFC<{ name: string, removePayee: RemovePayee }> = ({ name, removePayee }) => {
  return (
    <button className='button is-danger' onClick={() => removePayee(name)}>
      <span className='icon is-small'><i className='fas fa-trash-alt' /></span>
    </button>
  )
}

DeletePayeeLink.displayName = 'DeletePayeeLink'

export const PayeeList: React.SFC<Props> = (props) => {
  const payees = props.payees.map((payee) => {
    return (
      <LabelledField
        label={payee.name}
        key={payee.name}
        value={payee.publicKey}
        isClipped={true}
        addon={<DeletePayeeLink name={payee.name} removePayee={props.removePayee} />}
      />
    )
  })

  return (
    <div className='vertical-spaced'>
      <h1 className='title-heading has-text-centered'>MY PAYEES</h1>
      <section className='section'>
        {payees}
      </section>
    </div>
  )
}

PayeeList.displayName = 'PayeeList'
