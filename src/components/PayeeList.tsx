import { HorizontalLabelledField } from '@components'
import { Payee } from '@types'
import * as React from 'react'

type RemovePayee = (payeeName: string) => void
export interface Props {
  payees: Payee[]
  removePayee: RemovePayee
}

export const DeletePayeeLink: React.SFC<{name: string, removePayee: RemovePayee}> = ({name, removePayee}) => {
  return (
    <a
      className='delete'
      style={{marginTop: '3.5px'}}
      onClick={() => removePayee(name)}
    />
  )
}

export const PayeeList: React.SFC<Props> = (props) => {
  const payees = props.payees.map((payee) => {
    return (
      <HorizontalLabelledField
        label={payee.name}
        key={payee.name}
        value={payee.publicKey}
        addon={<DeletePayeeLink name={payee.name} removePayee={props.removePayee}/>}
      />
    )
  })

  return (
    <div className='vertical-spaced has-text-centered'>
      <h1 className='title-heading'>MY PAYEES</h1>
      <section className='section'>
        {payees}
      </section>
    </div>
  )
}
