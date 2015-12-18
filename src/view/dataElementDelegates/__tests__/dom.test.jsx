import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, DOM } from '../dom';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/domActions';

describe('dom view', () => {
  let render = props => {
    // Dispatch is sometimes needed by this component in componentWillMount regardless of whether
    // we're testing dispatch calls.
    props.dispatch = props.dispatch || function() {};

    return TestUtils.renderIntoDocument(
      <DOM {...props} />
    );
  };

  let getParts = component => {
    let textfields = TestUtils.scryRenderedComponentsWithType(component, Coral.Textfield)
    return {
      elementSelectorField: textfields[0],
      elementPropertySelect: TestUtils.findRenderedComponentWithType(component, Coral.Select),
      otherElementPropertyField: textfields.length > 1 ? textfields[1] : null
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      elementSelector: 'foo',
      elementProperty: 'innerHTML',
      errors: {
        elementSelectorInvalid: true,
        elementPropertyInvalid: true
      }
    }));

    expect(props).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML',
      elementSelectorInvalid: true,
      elementPropertyInvalid: true
    });
  });

  describe('element selector field', () => {
    it('is set with selector value', () => {
      let { elementSelectorField } = getParts(render({
        elementSelector: 'foo'
      }));

      expect(elementSelectorField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { elementSelectorField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(elementSelectorField), {
        target: {
          value: 'foo'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setElementSelector('foo'));
    });
  });

  describe('element property select', () => {
    it('is set with property value', () => {
      let { elementPropertySelect } = getParts(render({
        elementProperty: 'innerHTML'
      }));

      expect(elementPropertySelect.props.value).toBe('innerHTML');
    });

    it('is set to "other" when property does not match a preset', () => {
      let { elementPropertySelect } = getParts(render({
        elementProperty: 'foo'
      }));

      expect(elementPropertySelect.props.value).toBe('other');
    });

    it('dispatches an action on value change when a preset option is selected', () => {
      let dispatch = jasmine.createSpy();
      let { elementPropertySelect } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(elementPropertySelect), {
        target: {
          value: 'innerHTML'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setElementProperty('innerHTML'));
    });

    it('dispatches an action on value change when a non-preset option is selected', () => {
      let dispatch = jasmine.createSpy();
      let { elementPropertySelect } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(elementPropertySelect), {
        target: {
          value: 'other'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setElementProperty(''));
    });
  });

  describe('element property "other" field', () => {
    it('is set with property value when it is a non-preset', () => {
      let { otherElementPropertyField } = getParts(render({
        elementProperty: 'foo'
      }));

      expect(otherElementPropertyField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { otherElementPropertyField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(otherElementPropertyField), {
        target: {
          value: 'goose'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setElementProperty('goose'));
    });
  })
});
