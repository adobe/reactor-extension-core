import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, QueryParam } from '../queryParam';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/queryParamActions';

describe('cookie view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <QueryParam {...props} />
    );
  };

  let getParts = component => {
    return {
      nameField: TestUtils.findRenderedComponentWithType(component, Coral.Textfield),
      caseInsensitiveCheckbox: TestUtils.findRenderedComponentWithType(component, Coral.Checkbox)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      name: 'foo',
      caseInsensitive: true,
      errors: {
        nameIsEmpty: true
      }
    }));

    expect(props).toEqual({
      name: 'foo',
      caseInsensitive: true,
      nameIsEmpty: true
    });
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

  describe('case-insensitive checkbox', () => {
    it('is set with the caseInsensitive prop value', () => {
      let { caseInsensitiveCheckbox } = getParts(render({
        caseInsensitive: true
      }));

      expect(caseInsensitiveCheckbox.props.checked).toBe(true);
    });

    it('dispatches an action on checked change', () => {
      let dispatch = jasmine.createSpy();
      let { caseInsensitiveCheckbox } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(caseInsensitiveCheckbox), {
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setCaseInsensitive(true));
    });
  })
});
