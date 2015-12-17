import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, Custom } from '../custom';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/customActions';

describe('cookie view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <Custom {...props} />
    );
  };

  let getParts = component => {
    return {
      openEditorButton: TestUtils.findRenderedComponentWithType(component, Coral.Button)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      script: 'foo'
    }));

    expect(props).toEqual({
      script: 'foo'
    });
  });

  describe('script button', () => {
    beforeAll(function() {
      window.extensionBridge = {
        openCodeEditor: (code, callback) => {
          callback(code + ' (edited)');
        }
      };
    });

    afterAll(function() {
      delete window.extensionBridge;
    });

    it('opens the code editor and triggers action with edited code', () => {
      let dispatch = jasmine.createSpy();
      let { openEditorButton } = getParts(render({
        dispatch,
        script: 'foo'
      }));

      TestUtils.Simulate.click(ReactDOM.findDOMNode(openEditorButton));

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setScript('foo (edited)'));
    });
  });
});
