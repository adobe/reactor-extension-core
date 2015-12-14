import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, AdvancedEventOptions } from '../advancedEventOptions';
import DisclosureButton from '../disclosureButton';
import { actionCreators } from '../../actions/bubbleActions';
import { fromJS } from 'immutable';

describe('advanced event options', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <AdvancedEventOptions {...props} />
    );
  };

  let getParts = component => {
    let checkboxes = TestUtils.scryRenderedComponentsWithType(component, Coral.Checkbox);
    return {
      toggleButton: TestUtils.findRenderedComponentWithType(component, DisclosureButton),
      bubbleFireIfParentCheckbox: checkboxes[0],
      bubbleFireIfChildFiredCheckbox: checkboxes[1],
      bubbleStopCheckbox: checkboxes[2],
      checkboxes
    }
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: true
    }));

    expect(props).toEqual({
      bubbleFireIfParent: true,
      bubbleFireIfChildFired: true,
      bubbleStop: true
    });
  });

  it('toggles the advanced panel when the disclosure button is clicked', () => {
    let component = render();
    let { checkboxes, toggleButton } = getParts(component);

    expect(checkboxes.length).toBe(0);

    toggleButton.props.setSelected(true);
    checkboxes = getParts(component).checkboxes;

    expect(checkboxes.length).toBe(3);

    toggleButton.props.setSelected(false);
    checkboxes = getParts(component).checkboxes;

    expect(checkboxes.length).toBe(0);
  });

  describe('bubbleFireIfParent checkbox', () => {
    it('is checked when bubbleFireIfParent=true', () => {
      let component = render({
        bubbleFireIfParent: true
      });

      component.setState({
        expanded: true
      });

      let { bubbleFireIfParentCheckbox } = getParts(component);

      expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
    });

    it('dispatches action when clicked', () => {
      let dispatch = jasmine.createSpy();
      let component = render({ dispatch });

      component.setState({
        expanded: true
      });

      let { bubbleFireIfParentCheckbox } = getParts(component);
      let onChange = bubbleFireIfParentCheckbox.props['coral-onChange'];

      onChange({
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleFireIfParent(true));

      onChange({
        target: {
          checked: false
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleFireIfParent(false));
    });
  });

  describe('bubbleFireIfChildFired checkbox', () => {
    it('is checked when bubbleFireIfChildFired=true', () => {
      let component = render({
        bubbleFireIfChildFired: true
      });

      component.setState({
        expanded: true
      });

      let { bubbleFireIfChildFiredCheckbox } = getParts(component);

      expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
    });

    it('dispatches action when clicked', () => {
      let dispatch = jasmine.createSpy();
      let component = render({ dispatch });

      component.setState({
        expanded: true
      });

      let { bubbleFireIfChildFiredCheckbox } = getParts(component);
      let onChange = bubbleFireIfChildFiredCheckbox.props['coral-onChange'];

      onChange({
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleFireIfChildFired(true));

      onChange({
        target: {
          checked: false
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleFireIfChildFired(false));
    });
  });

  describe('bubbleStop checkbox', () => {
    it('is checked when bubbleStop=true', () => {
      let component = render({
        bubbleStop: true
      });

      component.setState({
        expanded: true
      });

      let { bubbleStopCheckbox } = getParts(component);

      expect(bubbleStopCheckbox.props.checked).toBe(true);
    });

    it('dispatches action when clicked', () => {
      let dispatch = jasmine.createSpy();
      let component = render({ dispatch });

      component.setState({
        expanded: true
      });

      let { bubbleStopCheckbox } = getParts(component);
      let onChange = bubbleStopCheckbox.props['coral-onChange'];

      onChange({
        target: {
          checked: true
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleStop(true));

      onChange({
        target: {
          checked: false
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setBubbleStop(false));
    });
  });
});
