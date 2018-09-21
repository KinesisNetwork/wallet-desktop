import { InputField } from '@components/InputField';
import * as React from 'react'

interface Props {
  onFieldChange: () => void
}

export const FilloutFieldPresentation: React.SFC<Props> = (props) => (
  <React.Fragment>
    <div className="field" style={{ position: 'relative' }}>
      <button
        className="button is-outlined is-light"
        style={{ position: 'absolute', left: '-15%', top: '1.47rem' }}
        onClick={props.onFieldChange}
      >
        <span className="icon">
          <i className="fal fa-lg fa-angle-left" />
        </span>
      </button>
      <InputField
        label='Contact name'
        value=''
        onChangeHandler={() => null}
        id='contact-name'
        icon='fa-user-circle'
      />
      <InputField
        label='Public Address'
        value=''
        placeholder='example: "GDUL65KWQ4PJA7FLO6467...CM7G"'
        onChangeHandler={() => null}
        id='public-address'
        icon='fa-qrcode'
      />
      <div className="level">
        <div className="level-left">
          <div className="field">
            <input
              id="switchRoundedSuccess"
              type="checkbox"
              name="switchRoundedSuccess"
              className="switch is-rounded is-success"
              checked={true}
              onChange={() => null}
            />
            <label>Save to contacts</label>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
)

export { FilloutFieldPresentation as FilloutField }
