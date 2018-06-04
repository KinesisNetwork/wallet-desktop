import { Payee } from '@types'
import * as React from 'react'

export interface Props {
  payees: Payee[]
  removePayee: (payeeName: string) => void
}

export const PayeeList: React.SFC<Props> = (props) => {
  const payees = props.payees.map((payee, index) => {
    return (
      <tr key={index}>
        <td>{payee.name}</td>
        <td>{payee.publicKey}</td>
        <td><a className='delete' onClick={() => props.removePayee(payee.name)}/></td>
      </tr>
    )
  })

  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Payee</th>
          <th>Public Key</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {payees}
      </tbody>
    </table>
  )
}
