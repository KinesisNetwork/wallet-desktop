import * as React from 'react'

interface EditableProps {
  isEditing: boolean
  value: string
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>
  onStopEditing: React.FocusEventHandler<HTMLInputElement>
  onStartEditing: React.UIEventHandler<HTMLInputElement>
}
export class EditableText extends React.Component<EditableProps> {
  render() {
    return (
      <div className={this.controlClasses()}>
        <input
          className={this.inputClasses()}
          value={this.props.value}
          onChange={this.props.onChangeHandler}
          onBlur={this.props.onStopEditing}
          onClick={this.onClick}
        />
        {!this.props.isEditing && (
          <span className="icon is-right">
            <i className="fa fa-edit" />
          </span>
        )}
      </div>
    )
  }
  private onClick = ev => (!this.props.isEditing ? this.props.onStartEditing(ev) : null)
  private inputClasses = () =>
    this.props.isEditing ? 'input has-text-centered' : 'button is-text is-fullwidth has-icons-right'
  private controlClasses = () =>
    ['control', 'is-expanded', !this.props.isEditing ? 'has-icons-right' : ''].join(' ')
}
