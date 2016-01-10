import React from 'react';
import ReactDOM from 'react-dom';
import Coral from 'coralui-support-react';
import TestUtils from 'react-addons-test-utils';
import { mapStateToProps, CartAmount } from '../cartAmount';
import { fromJS } from 'immutable';
import { actionCreators } from '../actions/cartAmountActions';
import DataElementNameField from '../components/dataElementNameField';
import ComparisonOperatorField from '../components/comparisonOperatorField';

describe('cart amount view', () => {
  let render = props => {
    return TestUtils.renderIntoDocument(
      <CartAmount {...props} />
    );
  };

  let getParts = component => {
    return {
      dataElementNameField: TestUtils.findRenderedComponentWithType(component, DataElementNameField),
      operatorField: TestUtils.findRenderedComponentWithType(component, ComparisonOperatorField),
      amountField: TestUtils.scryRenderedComponentsWithType(component, Coral.Textfield)[1]
    };
  };

  it('maps state to props', () => {
    let props = mapStateToProps(fromJS({
      dataElementName: 'foo',
      operator: '>',
      amount: 123,
      errors: {
        dataElementNameIsEmpty: true,
        amountIsEmpty: true,
        amountIsNaN: true
      }
    }));

    expect(props).toEqual({
      dataElementName: 'foo',
      operator: '>',
      amount: 123,
      dataElementNameIsEmpty: true,
      amountIsEmpty: true,
      amountIsNaN: true
    })
  });

  describe('data element name field', () => {
    it('is set with name prop value', () => {
      let { dataElementNameField } = getParts(render({
        dataElementName: 'foo'
      }));

      expect(dataElementNameField.props.value).toBe('foo');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { dataElementNameField } = getParts(render({
        dispatch
      }));

      dataElementNameField.props.onChange('foo');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setDataElementName('foo'));
    });
  });

  describe('operator field', () => {
    it('is set with operator prop value', () => {
      let { operatorField } = getParts(render({
        operator: '<'
      }));

      expect(operatorField.props.value).toBe('<');
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { operatorField } = getParts(render({
        dispatch
      }));

      operatorField.props.onChange('<');

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setOperator('<'));
    });
  });

  describe('amount field', () => {
    it('is set with amount value', () => {
      let { amountField } = getParts(render({
        amount: 123
      }));

      expect(amountField.props.value).toBe(123);
    });

    it('dispatches an action on value change', () => {
      let dispatch = jasmine.createSpy();
      let { amountField } = getParts(render({
        dispatch
      }));

      TestUtils.Simulate.change(ReactDOM.findDOMNode(amountField), {
        target: {
          value: '123'
        }
      });

      expect(dispatch).toHaveBeenCalledWith(actionCreators.setAmount('123'));
    });
  });
});
