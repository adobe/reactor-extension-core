import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { fromJS } from 'immutable';
import { mapStateToProps, Variable } from '../variable';
import { actionCreators } from '../actions/variableActions';

describe('variable view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Variable {...props} />
    );
  };

  let getParts = component => {
    return {
      pathField: TestUtils.findRenderedComponentWithType(component, Coral.Textfield)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      path: 'foo',
      errors: {
        pathIsEmpty: true
      }
    }));

    expect(props).toEqual({
      path: 'foo',
      pathIsEmpty: true
    });
  });

  describe('path field', () => {
    it('is set with path prop value', () => {
      let { pathField } = getParts(render({
        path: 'foo'
      }));

      expect(pathField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { pathField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(pathField), {
        target: {
          value: 'foo'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setPath('foo'));
    });
  });
});
