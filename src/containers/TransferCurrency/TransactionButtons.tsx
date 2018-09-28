import { RouterAction } from 'connected-react-router'
import * as React from 'react'

interface ButtonGroups {
  cancelText: string
  nextStepText: string
  cancelButtonClick: () => RouterAction
  nextStepButtonClick: () => void
  isDisabled?: boolean
}

export const TransactionButtons: React.SFC<ButtonGroups> = (props: ButtonGroups) => (
  <section className="field is-grouped is-grouped-right">
    <p className="control">
      <button className="button is-text" onClick={props.cancelButtonClick}>
        {props.cancelText}
      </button>
    </p>
    <p className="control">
      <button
        className="button is-primary"
        onClick={props.nextStepButtonClick}
        disabled={props.isDisabled}
      >
        <span className="icon">
          <i className="fal fa-arrow-up" />
        </span>
        <span>{props.nextStepText}</span>
      </button>
    </p>
  </section>
)
