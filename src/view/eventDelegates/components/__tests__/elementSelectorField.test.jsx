import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Coral from 'coralui-support-react';
import ValidationWrapper from '../../../components/validationWrapper';
import { mapStateToProps, ElementSelectorField } from '../elementSelectorField';
import { fromJS } from 'immutable';
import { actionCreators } from '../../actions/common/elementFilterActions';

describe('element selector field', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(<ElementSelectorField {...props}/>);
  };

  let getParts = component => {
    return {
      field: TestUtils.findRenderedComponentWithType(component, Coral.Textfield),
      validationWrapper: TestUtils.findRenderedComponentWithType(component, ValidationWrapper)
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      elementSelector: 'foo',
      errors: {
        selectorInvalid: true
      }
    }));

    expect(props).toEqual({
      elementSelector: 'foo',
      selectorInvalid: true
    });
  });

  it('populates the field with the selector', () => {
    let { field } = getParts(render({
      elementSelector: 'foo'
    }));

    expect(field.props.value).toBe('foo');
  });

  it('dispatches an action when the field value changes', () => {
    let dispatch = jasmine.createSpy();
    let { field } = getParts(render({
      dispatch
    }));

    TestUtils.Simulate.change(ReactDOM.findDOMNode(field), {
      target: {
        value: 'foo'
      }
    });

    expect(dispatch).toHaveBeenCalledWith(actionCreators.setElementSelector('foo'));
  });

  it('displays an invalid selector error', () => {
    let { validationWrapper } = getParts(render({
      selectorInvalid: true
    }));

    expect(validationWrapper.props.error).toBeDefined();
  })
});
