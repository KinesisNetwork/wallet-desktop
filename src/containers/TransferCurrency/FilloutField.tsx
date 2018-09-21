import * as React from 'react'

interface Props {
  onFieldChange: () => void
}

export const FilloutFieldPresentation: React.SFC<Props> = (props) => (
  <div onClick={props.onFieldChange}>Filloutcomponent</div>
)

export { FilloutFieldPresentation as FilloutField }
