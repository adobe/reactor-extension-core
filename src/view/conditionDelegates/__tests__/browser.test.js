import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, Browser } from '../browser';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/browserActions';

describe('browser view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Browser {...props} />
    );
  };

  let getParts = component => {
    return {
      checkboxes: TestUtils.scryRenderedComponentsWithType(component, Coral.Checkbox)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      browsers: ['Chrome', 'IE']
    }));

    expect(props.browsers.toJS()).toEqual(['Chrome', 'IE']);
  });

  describe('browser checkboxes', () => {
    it('are selected from browsers prop value', () => {
      let { checkboxes } = getParts(render({
        browsers: List(['Chrome', 'IE'])
      }));

      expect(checkboxes.length).toBeGreaterThan(0);

      checkboxes.forEach((checkbox, index) => {
        expect(checkbox.props.checked).toBe(index === 0 || index === 2);
      });
    });

    it('dispatches an action on toggle', () => {
      let dispatch = jasmine.createSpy();
      let { checkboxes } = getParts(render({
        browsers: List([]),
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(checkboxes[2]), {
        target: {
          checked: true,
          value: 'IE'
        }
      });

      let action = dispatch.calls.argsFor(0)[0];
      expect(action.type).toEqual('conditionDelegates/browser/SET_BROWSERS');
      expect(action.payload.toJS()).toEqual(['IE']);
    });
  });
});
