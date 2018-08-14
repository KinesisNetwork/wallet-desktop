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
})
