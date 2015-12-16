import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import ElementPropertyEditor from '../elementPropertyEditor';
import RegexToggle from '../../../components/regexToggle';

describe('element property editor', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(<ElementPropertyEditor {...props}/>);
  };

  let getParts = component => {
    let textFields = TestUtils.scryRenderedComponentsWithType(component, Coral.Textfield);
    return {
      nameField: textFields[0],
      valueField: textFields[1],
      valueIsRegexSwitch: TestUtils.findRenderedComponentWithType(component, RegexToggle),
      removeButton: component.refs.removeButton
    };
  };

  it('populates fields from properties', () => {
    let { nameField, valueField, valueIsRegexSwitch, removeButton } = getParts(render({
      removable: true,
      name: 'innerHTML',
      value: 'foo',
      valueIsRegex: true
    }));

    expect(removeButton).toBeDefined();
    expect(nameField.props.value).toBe('innerHTML');
    expect(valueField.props.value).toBe('foo');
    expect(valueIsRegexSwitch.props.value).toBe('foo');
    expect(valueIsRegexSwitch.props.valueIsRegex).toBe(true);
  });

  it ('calls remove on remove click', () => {
    let remove = jasmine.createSpy();
    let { removeButton } = getParts(render({
      removable: true,
      remove
    }));

    TestUtils.Simulate.click(ReactDOM.findDOMNode(removeButton));

    expect(remove).toHaveBeenCalled();
  });

  it('calls setName on name change', () => {
    let setName = jasmine.createSpy();
    let { nameField } = getParts(render({
      setName
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(nameField), {
      target: {
        value: 'newname'
      }
    });

    expect(setName).toHaveBeenCalledWith('newname');
  });

  it('calls setValue on value change', () => {
    let setValue = jasmine.createSpy();
    let { valueField } = getParts(render({
      setValue
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(valueField), {
      target: {
        value: 'newvalue'
      }
    });

    expect(setValue).toHaveBeenCalledWith('newvalue');
  });

  it('calls setValue and setValueIsRegex on valueIsRegex switch changes', () => {
    let setValue = jasmine.createSpy();
    let setValueIsRegex = jasmine.createSpy();
    let { valueIsRegexSwitch } = getParts(render({
      setValue,
      setValueIsRegex
    }));

    valueIsRegexSwitch.props.setValue('newvalue');
    expect(setValue).toHaveBeenCalledWith('newvalue');

    valueIsRegexSwitch.props.setValueIsRegex(true);
    expect(setValueIsRegex).toHaveBeenCalledWith(true);
  });
});
