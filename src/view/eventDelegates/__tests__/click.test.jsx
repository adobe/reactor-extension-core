import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps } from '../click';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/clickActions';
import MockComponent from '../../__tests__/helpers/mockComponent';

describe('click view', () => {
  let Click;

  let render = props => {
    return TestUtils.renderIntoDocument(
      <Click {...props} />
    );
  };

  let getParts = component => {
    return {
      delayLinkActivationCheckbox:
        TestUtils.findRenderedComponentWithType(component, Coral.Checkbox)
    };
  };

  beforeAll(() => {
    let inject = require('inject?' +
      './components/advancedEventOptions&' +
      './components/elementFilter' +
      '!../click');
    Click = inject({
      './components/advancedEventOptions': MockComponent,
      './components/elementFilter': MockComponent
    }).Click;
  });


  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      delayLinkActivation: true
    }));

    expect(props).toEqual({
      delayLinkActivation: true
    });
  });

  describe('delay link activation checkbox', () => {
    it('is checked with delayLinkActivation=true', () => {
      let { delayLinkActivationCheckbox } = getParts(render({
        delayLinkActivation: true
      }));

      expect(delayLinkActivationCheckbox.props.checked).toBe(true);
    });

    it('dispatches an action when clicked', () => {
      let dispatch = jasmine.createSpy();
      let { delayLinkActivationCheckbox } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(delayLinkActivationCheckbox), {
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setDelayLinkActivation(true));
    });
  })
});
