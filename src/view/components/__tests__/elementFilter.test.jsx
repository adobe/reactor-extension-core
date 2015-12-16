import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { fromJS } from 'immutable';
import MockComponent from './helpers/mockComponent';
import { actionCreators } from '../../actions/common/elementFilterActions';
import { mapStateToProps } from '../elementFilter';

describe('element filter', () => {
  let ElementFilter;

  let render = props => {
    return TestUtils.renderIntoDocument(<ElementFilter {...props} />);
  };

  let getParts = component => {
    let radios = TestUtils.scryRenderedComponentsWithType(component, Coral.Radio);
    return {
      specificElementFields: component.refs.specificElementFields,
      elementPropertiesEditor: component.refs.elementPropertiesEditor,
      specificElementsRadio: radios[0],
      anyElementRadio: radios[1]
    };
  };

  beforeAll(() => {
    let elementFilterInjector = require('inject?' +
        '../components/elementSelectorField&' +
        '../components/elementPropertiesEditor' +
        '!../elementFilter');
    ElementFilter = elementFilterInjector({
      '../components/elementSelectorField': MockComponent,
      '../components/elementPropertiesEditor': MockComponent
    }).ElementFilter;
  });

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      showSpecificElementsFilter: true,
      showElementPropertiesFilter: true
    }));

    expect(props).toEqual({
      showSpecificElementsFilter: true,
      showElementPropertiesFilter: true
    });
  });

  it('shows filter fields when showSpecificElementsFilter=true', () => {
    let { specificElementFields } = getParts(render({
      showSpecificElementsFilter: true
    }));

    expect(specificElementFields).toBeDefined();
  });

  it('does not show filter fields when showSpecificElementsFilter=false', () => {
    let { specificElementFields } = getParts(render());

    expect(specificElementFields).toBeUndefined();
  });

  it('shows element property fields when showElementPropertiesFilter=true', () => {
    let { elementPropertiesEditor } = getParts(render({
      showSpecificElementsFilter: true,
      showElementPropertiesFilter: true
    }));

    expect(elementPropertiesEditor).toBeDefined();
  });

  it('does not show element property fields when showElementPropertiesFilter=false', () => {
    let { elementPropertiesEditor } = getParts(render({
      showSpecificElementsFilter: true,
      showElementPropertiesFilter: false
    }));

    expect(elementPropertiesEditor).toBeUndefined();
  });

  it('does not show element property fields when showSpecificElementsFilter=false and' +
    'showElementPropertiesFilter=true', () => {
    let { elementPropertiesEditor } = getParts(render({
      showSpecificElementsFilter: false,
      showElementPropertiesFilter: true
    }));

    expect(elementPropertiesEditor).toBeUndefined();
  });

  it('dispatches action when "specific elements" radio is selected', () => {
    let dispatch = jasmine.createSpy();
    let { specificElementsRadio } = getParts(render({
      dispatch
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(specificElementsRadio), {
      target: {
        value: 'true'
      }
    });

    expect(dispatch).toHaveBeenCalledWith(actionCreators.setShowSpecificElementsFilter(true));
  });

  it('dispatches action when "any element" radio is selected', () => {
    let dispatch = jasmine.createSpy();
    let { anyElementRadio } = getParts(render({
      dispatch
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(anyElementRadio), {
      target: {
        value: 'false'
      }
    });

    expect(dispatch).toHaveBeenCalledWith(actionCreators.setShowSpecificElementsFilter(false));
  });
});
