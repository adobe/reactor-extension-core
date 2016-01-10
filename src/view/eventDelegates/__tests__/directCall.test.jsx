import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { fromJS } from 'immutable';
import { mapStateToProps, DirectCall } from '../directCall';
import { actionCreators } from '../actions/directCallActions';

describe('direct call view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <DirectCall {...props} />
    );
  };

  let getParts = component => {
    return {
      nameField: TestUtils.findRenderedComponentWithType(component, Coral.Textfield)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      name: 'foo',
      errors: {
        nameIsEmpty: true
      }
    }));

    expect(props).toEqual({
      name: 'foo',
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

    it('dispatches an action on name change', () => {
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
});
