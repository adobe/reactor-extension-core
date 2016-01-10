import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../cartAmountActions';

describe('cart amount actions', () => {
  it('sets data element name', () => {
    testPassThroughAction(reducer, actionCreators.setDataElementName, 'dataElementName');
  });

  it('sets operator', () => {
    testPassThroughAction(reducer, actionCreators.setOperator, 'operator');
  });

  it('sets amount', () => {
    testPassThroughAction(reducer, actionCreators.setAmount, 'amount');
  });
});
