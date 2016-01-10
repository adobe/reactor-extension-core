import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, Cookie } from '../cookie';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/cookieActions';
import RegexToggle from '../../components/regexToggle';

describe('cookie view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Cookie {...props} />
    );
  };

  let getParts = component => {
    let textfields = TestUtils.scryRenderedComponentsWithType(component, Coral.Textfield);
    return {
      nameField: textfields[0],
      valueField: textfields[1],
      valueIsRegexSwitch: TestUtils.findRenderedComponentWithType(component, RegexToggle),
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true,
      errors: {
        nameIsEmpty: true,
        valueIsEmpty: true
      }
    }));

    expect(props.name).toBe('foo');
    expect(props.value).toBe('bar');
    expect(props.valueIsRegex).toBe(true);
    expect(props.nameIsEmpty).toBe(true);
    expect(props.valueIsEmpty).toBe(true);
  });

  describe('name field', () => {
    it('is set with name prop value', () => {
      let { nameField } = getParts(render({
        name: 'foo'
      }));

      expect(nameField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { nameField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(nameField), {
        target: {
          value: 'foo'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setName('foo'));
    });
  });

  describe('value field', () => {
    it('is set with value prop value', () => {
      let { valueField } = getParts(render({
        value: 'bar'
      }));

      expect(valueField.props.value).toBe('bar');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { valueField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(valueField), {
        target: {
          value: 'bar'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setValue('bar'));
    });
  });

  describe('valueIsRegex switch', () => {
    it('is set with value prop value', () => {
      let { valueIsRegexSwitch } = getParts(render({
        value: 'bar'
      }));

      expect(valueIsRegexSwitch.props.value).toBe('bar');
    });

    it('is set with valueIsRegex prop value', () => {
      let { valueIsRegexSwitch } = getParts(render({
        valueIsRegex: true
      }));

      expect(valueIsRegexSwitch.props.valueIsRegex).toBe(true);
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { valueIsRegexSwitch } = getParts(render({
        dispatch
      }));

      valueIsRegexSwitch.props.setValue('biscuit');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setValue('biscuit'));
    });

    it('dispatches an action on valueIsRegex change', () => {
      let dispatch = jasmine.createSpy();
      let { valueIsRegexSwitch } = getParts(render({
        dispatch
      }));

      valueIsRegexSwitch.props.setValueIsRegex(true);

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setValueIsRegex(true));
    });
  });

});
