import { RouterAction } from 'connected-react-router'
import * as React from 'react'

interface ButtonGroups {
  copyText?: string
  cancelText: string
  nextStepText: string
  copyButtonClick?: () => void
  cancelButtonClick: () => RouterAction
  nextStepButtonClick: () => void
  isDisabled?: boolean
}

export const TransferButtons: React.SFC<ButtonGroups> = (props: ButtonGroups) => (
  <section className="field is-grouped is-grouped-right">
    {props.copyText && (
      <p className="control">
        <button className="button is-text" onClick={props.copyButtonClick}>
          {props.copyText}
        </button>
      </p>
    )}
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
