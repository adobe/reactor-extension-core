import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, DOM } from '../dom';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/domActions';

describe('dom view', () => {
  const MOCK_ELEMENT_PROPERTY_PRESETS = [
    {
      value: 'preset',
      label: 'my preset'
    },
    {
      value: 'custom',
      label: 'other attribute'
    }
  ];

  let render = props => {
    // Dispatch is sometimes needed by this component in componentWillMount regardless of whether
    // we're testing dispatch calls.
    if (!props.dispatch) {
      props.dispatch = function() {};
    }

    if (!props.elementPropertyPresets) {
      props.elementPropertyPresets = fromJS(MOCK_ELEMENT_PROPERTY_PRESETS);
    }

    return TestUtils.renderIntoDocument(
      <DOM {...props} />
    );
  };

  let getParts = component => {
    let textfields = TestUtils.scryRenderedComponentsWithType(component, Coral.Textfield)
    return {
      elementSelectorField: textfields[0],
      elementPropertyPresetSelect: TestUtils.findRenderedComponentWithType(component, Coral.Select),
      customElementPropertyField: textfields.length > 1 ? textfields[1] : null
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      elementSelector: 'foo',
      selectedElementPropertyPreset: 'innerHTML',
      customElementProperty: 'foo',
      elementPropertyPresets: MOCK_ELEMENT_PROPERTY_PRESETS,
      errors: {
        elementSelectorIsEmpty: true,
        elementPropertyIsEmpty: true
      }
    }));

    expect(props).toEqual({
      elementSelector: 'foo',
      selectedElementPropertyPreset: 'innerHTML',
      customElementProperty: 'foo',
      elementPropertyPresets: jasmine.any(Object),
      elementSelectorIsEmpty: true,
      elementPropertyIsEmpty: true
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

  describe('element property preset select', () => {
    it('is set with selected element property preset', () => {
      let { elementPropertyPresetSelect } = getParts(render({
        selectedElementPropertyPreset: 'innerHTML'
      }));

      expect(elementPropertyPresetSelect.props.value).toBe('innerHTML');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { elementPropertyPresetSelect } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(elementPropertyPresetSelect), {
        target: {
          value: 'innerHTML'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setSelectedElementPropertyPreset('innerHTML'));
    });
  });

  describe('custom element property field', () => {
    it('is set with custom element property value', () => {
      let { customElementPropertyField } = getParts(render({
        selectedElementPropertyPreset: 'custom',
        customElementProperty: 'foo'
      }));

      expect(customElementPropertyField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { customElementPropertyField } = getParts(render({
        dispatch,
        selectedElementPropertyPreset: 'custom'
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(customElementPropertyField), {
        target: {
          value: 'goose'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setCustomElementProperty('goose'));
    });
  })
});
