import * as React from 'react'

interface Props {
  children: JSX.Element | JSX.Element[]
  hasBackground: boolean
  isActive: boolean
}
export class Modal extends React.Component<Props> {
  get activeClass() {
    return this.props.isActive ? 'is-active' : ''
  }

  render() {
    const { children, hasBackground } = this.props
    return (
      <aside className={`modal ${this.activeClass}`}>
        {hasBackground && <div className="modal-background" />}
        <section className="modal-content">{children}</section>
      </aside>
    )
  }
}
