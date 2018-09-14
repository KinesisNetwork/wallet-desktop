import * as React from 'react'

interface Props {
  hasConfirmed: boolean
  onConfirmChange: React.ChangeEventHandler<HTMLInputElement>
}

const TermsAndConditionsPresentation: React.SFC<Props> = props => (
  <div className="field">
    <div className="control">
      <input
        type="checkbox"
        className="is-checkradio"
        id="tcs"
        name="tcs"
        checked={props.hasConfirmed}
        onChange={props.onConfirmChange}
      />
      <label htmlFor="tcs">I agree with the</label>
      <a href="https://kinesis.money" target="_blank">
        Terms of Service
      </a>
    </div>
  </div>
)

export { TermsAndConditionsPresentation as TermsAndConditions }
