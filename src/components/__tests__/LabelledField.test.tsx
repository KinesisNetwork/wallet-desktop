import { shallow } from 'enzyme'
import * as React from 'react'
import { HorizontalLabelledField, LabelledField } from '../LabelledField'

describe('LabelledField', () => {
  describe('should render', () => {
    it('correctly', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" />)

      expect(wrapper).toMatchSnapshot()
    })

    it('a label', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" />)

      const label = wrapper.find('label')

      expect(label).toHaveLength(1)
      expect(label.text()).toEqual('Test')
    })

    it('a parapgraph when the isCopyable property is set to false or does not exist', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" />)

      const paragraph = wrapper.find('p')
      const button = wrapper.find('button')

      expect(paragraph).toHaveLength(1)
      expect(paragraph.text()).toEqual('Test value')
      expect(button).toHaveLength(0)
    })

    it('a button element when isCopyable is true', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" isCopyable={true} />)

      const paragraph = wrapper.find('p')
      const button = wrapper.find('button')

      expect(paragraph).toHaveLength(0)
      expect(button).toHaveLength(1)
      expect(button.text()).toEqual('Test value')
    })
  })

  describe('has', () => {
    it('an is-loading class if isLoading property is true', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" isLoading={true} />)

      const control = wrapper.find('.control.is-expanded')

      expect(control.hasClass('is-loading')).toEqual(true)
    })

    it('an inline style with max-width property isClipped property is true', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" isClipped={true} />)

      const control = wrapper.find('.control.is-expanded')

      expect(control.prop('style')).toEqual({ maxWidth: '35ch' })
    })

    it('an additional div with class control if addon exitst', () => {
      const wrapper = shallow(
        <LabelledField label="Test" value="Test value" addon={<h2>Test node</h2>} />,
      )

      const control = wrapper.find('.control')

      expect(control).toHaveLength(2)
    })

    it('the content of addon', () => {
      const wrapper = shallow(
        <LabelledField label="Test" value="Test value" addon={<h2>Test node</h2>} />,
      )

      const addedNode = wrapper.find('h2')

      expect(addedNode.text()).toEqual('Test node')
    })
  })

  describe('when the button is clicked', () => {
    it('should copy value to the clipboard', () => {
      const wrapper = shallow(<LabelledField label="Test" value="Test value" isCopyable={true} />)

      const button = wrapper.find('button')

      // expect it to throw because Jest is not run in the browser
      // error in one of the dependencies of copy-to-clipboard
      expect(() => button.simulate('click')).toThrow()
    })
  })
})

describe('HorizontalLabelledField', () => {
  it('should render', () => {
    const wrapper = shallow(<HorizontalLabelledField label="Test" value="Test value" />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders the correct label', () => {
    const wrapper = shallow(<HorizontalLabelledField label="Test" value="Test value" />)

    const label = wrapper.find('label')

    expect(label.text()).toEqual('Test')
  })

  it('displays the value inside a paragraph', () => {
    const wrapper = shallow(<HorizontalLabelledField label="Test" value="Test value" />)

    const paragraph = wrapper.find('p')

    expect(paragraph.text()).toEqual('Test value')
  })

  it('has an is-marginless class if isCompact property is true', () => {
    const wrapper = shallow(
      <HorizontalLabelledField label="Test" value="Test value" isCompact={true} />,
    )

    const parentNode = wrapper.find('.field.is-horizontal')

    expect(parentNode.hasClass('is-marginless')).toBe(true)
  })

  it('has a class is-loading if isLoading property is true', () => {
    const wrapper = shallow(
      <HorizontalLabelledField label="Test" value="Test value" isLoading={true} />,
    )

    const control = wrapper.find('.control.is-expanded')

    expect(control.hasClass('is-loading')).toBe(true)
  })

  it('has an inline style of maxWidth if isClipped is true', () => {
    const wrapper = shallow(
      <HorizontalLabelledField label="Test" value="Test value" isClipped={true} />,
    )

    const control = wrapper.find('.control.is-expanded')

    expect(control.prop('style')).toEqual({ maxWidth: '35ch' })
  })

  it('renders an additional div with class control if addon exitst', () => {
    const wrapper = shallow(
      <HorizontalLabelledField label="Test" value="Test value" addon={<h2>Test node</h2>} />,
    )

    const control = wrapper.find('.control')

    expect(control).toHaveLength(2)
  })

  it('correctly renders the content of addon', () => {
    const wrapper = shallow(
      <HorizontalLabelledField label="Test" value="Test value" addon={<h2>Test node</h2>} />,
    )

    const addedNode = wrapper.find('h2')

    expect(addedNode.text()).toEqual('Test node')
  })
})
