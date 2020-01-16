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
      <label htmlFor="tcs">
        I acknowledge that I have read and agreed to the{' '}
        <a href="https://kinesis.money/en/terms-of-use-and-service/" target="_blank">
          {' '}
          Terms of Use
        </a>
      </label>
    </div>
  </div>
)

export { TermsAndConditionsPresentation as TermsAndConditions }
