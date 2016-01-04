import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, CookieOptOut } from '../cookieOptOut';
import { fromJS, List } from 'immutable';
import { actionCreators } from '../actions/cookieOptOutActions';

describe('cookie opt-out view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <CookieOptOut {...props} />
    );
  };

  let getParts = component => {
    return {
      checkbox: TestUtils.findRenderedComponentWithType(component, Coral.Checkbox)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      acceptsCookies: true
    }));

    expect(props.acceptsCookies).toBe(true);
  });

  describe('accepts cookies checkbox', () => {
    it('is selected from acceptsCookies prop value', () => {
      let { checkbox } = getParts(render({
        acceptsCookies: true
      }));

      expect(checkbox.props.checked).toBe(true);
    });

    it('dispatches an action when clicked', () => {
      let dispatch = jasmine.createSpy();
      let { checkbox } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(checkbox), {
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setAcceptsCookies(true));
    });
  });
});
