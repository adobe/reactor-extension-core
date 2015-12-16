import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { Map, List } from 'immutable';
import { mapStateToProps, ElementPropertiesEditor } from '../elementPropertiesEditor';
import ElementPropertyEditor from '../elementPropertyEditor';
import { actionCreators } from '../../actions/common/elementFilterActions';

describe('element properties editor', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(<ElementPropertiesEditor {...props}/>);
  };

  let getParts = component => {
    return {
      itemEditors: TestUtils.scryRenderedComponentsWithType(component, ElementPropertyEditor),
      addButton: component.refs.addButton
    }
  };

  it('maps state to props', () => {
    let elementProperties = List();

    let props = mapStateToProps(Map({
      elementProperties
    }));

    expect(props).toEqual({
      elementProperties
    });
  });

  it('displays an item editor for each element property', () => {
    let { itemEditors } = getParts(render({
      elementProperties: List([
        Map({
          id: 'abc',
          name: 'innerHTML',
          value: 'foo'
        }),
        Map({
          id: 'def',
          name: 'className',
          value: 'goo',
          valueIsRegex: true
        })
      ])
    }));

    expect(itemEditors.length).toBe(2);

    let sampleItemEditor = itemEditors[1];

    expect(sampleItemEditor.props.name).toBe('className');
    expect(sampleItemEditor.props.value).toBe('goo');
    expect(sampleItemEditor.props.valueIsRegex).toBe(true);
    expect(sampleItemEditor.props.removable).toBe(true);
  });

  it('adds an item editor when the add button is clicked', () => {
    let dispatch = jasmine.createSpy();

    let component = render({
      dispatch,
      elementProperties: List()
    });

    let { addButton } = getParts(component);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(addButton));

    expect(dispatch).toHaveBeenCalledWith(actionCreators.addElementProperty({
      name: '',
      value: ''
    }));
  });

  describe('element property actions', () => {
    let dispatch;
    let itemEditor;

    beforeAll(() => {
      dispatch = jasmine.createSpy();
      let { itemEditors } = getParts(render({
        dispatch,
        elementProperties: List([
          Map({
            id: 'abc',
            name: 'innerHTML',
            value: 'foo'
          })
        ])
      }));

      itemEditor = itemEditors[0];
    });

    it('sets name', () => {
      itemEditor.props.setName('newname');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.editElementProperty({
        id: 'abc',
        name: 'newname'
      }));
    });

    it('sets value', () => {
      itemEditor.props.setValue('newvalue');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.editElementProperty({
        id: 'abc',
        value: 'newvalue'
      }));
    });

    it('sets valueIsRegex', () => {
      itemEditor.props.setValueIsRegex(true);

      expect(dispatch).toHaveBeenCalledWith(actionCreators.editElementProperty({
        id: 'abc',
        valueIsRegex: true
      }));
    });

    it('removes element property', () => {
      itemEditor.props.remove();

      expect(dispatch).toHaveBeenCalledWith(actionCreators.removeElementProperty('abc'));
    });
  });
});
