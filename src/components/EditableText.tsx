import * as React from 'react'

interface EditableProps {
  isEditing: boolean
  value: string
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>
  onStopEditing: () => void
  onStartEditing: React.UIEventHandler<HTMLInputElement>
  opts?: { isLarge: boolean }
}
export class EditableText extends React.Component<EditableProps> {
  render() {
    const isLarge = this.props.opts && this.props.opts.isLarge

    return (
      <div className={this.controlClasses()}>
        <input
          style={{ textTransform: 'initial' }}
          className={this.inputClasses() + (isLarge ? ' is-large' : '')}
          value={this.props.value}
          onChange={this.props.onChangeHandler}
          onBlur={this.onBlur}
          onClick={this.onClick}
          onFocus={this.onClick}
        />
        {!this.props.isEditing && (
          <span className="icon is-right" style={isLarge ? { fontSize: '24px' } : {}}>
            <i className="fal fa-edit" />
          </span>
        )}
      </div>
    )
  }

  private onBlur = () => (this.props.isEditing ? this.props.onStopEditing() : null)
  private onClick = ev => (!this.props.isEditing ? this.props.onStartEditing(ev) : null)
  private inputClasses = () =>
    this.props.isEditing ? 'input has-text-centered' : 'button is-text is-fullwidth has-icons-right'
  private controlClasses = () =>
    ['control', 'is-expanded', !this.props.isEditing ? 'has-icons-right' : ''].join(' ')
}
