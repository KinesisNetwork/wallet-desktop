import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import { LabelledField } from '../LabelledField'

Enzyme.configure({ adapter: new Adapter() })

describe('LabelledField', () => {

  describe('should render', () => {
    it('correctly', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' />)

      expect(wrapper).toMatchSnapshot()
    })

    it('a label', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' />)

      const label: Enzyme.ShallowWrapper = wrapper.find('label')

      expect(label).toHaveLength(1)
      expect(label.text()).toEqual('Test')
    })

    it('a parapgraph when the isCopyable property is set to false or does not exist', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' />)

      const paragraph: Enzyme.ShallowWrapper = wrapper.find('p')
      const button: Enzyme.ShallowWrapper = wrapper.find('button')

      expect(paragraph).toHaveLength(1)
      expect(paragraph.text()).toEqual('Test value')
      expect(button).toHaveLength(0)
    })

    it('a button element when isCopyable is true', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' isCopyable={true} />)

      const paragraph: Enzyme.ShallowWrapper = wrapper.find('p')
      const button: Enzyme.ShallowWrapper = wrapper.find('button')

      expect(paragraph).toHaveLength(0)
      expect(button).toHaveLength(1)
      expect(button.text()).toEqual('Test value')
    })
  })

  describe('has', () => {
    it('an is-loading class if isLoading property is true', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' isLoading={true} />)

      const control = wrapper.find('.control.is-expanded')

      expect(control.hasClass('is-loading')).toEqual(true)
    })

    it('an inline style with max-width property isClipped property is true', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' isClipped={true} />)

      const control = wrapper.find('.control.is-expanded')

      expect(control.prop('style')).toEqual({ maxWidth: '35ch' })
    })

    it('an additional div with class control if addon exitst', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' addon={<h2>Test node</h2>} />)

      const control = wrapper.find('.control')

      expect(control).toHaveLength(2)
    })

    it('the content of addon', () => {
      const wrapper: Enzyme.ShallowWrapper = shallow(<LabelledField label='Test' value='Test value' addon={<h2>Test node</h2>} />)

      const addedNode = wrapper.find('h2')

      expect(addedNode.text()).toEqual('Test node')
    })
  })

  describe('when the button is clicked', () => {
    it('should copy value to the clipboard', () => {
      const wrapper = shallow(<LabelledField label='Test' value='Test value' isCopyable={true} />)

      const button = wrapper.find('button')

      // expect it to throw because Jest is not run in the browser
      // error in one of the dependencies of copy-to-clipboard
      expect(() => button.simulate('click')).toThrow()
    })
  })
})
