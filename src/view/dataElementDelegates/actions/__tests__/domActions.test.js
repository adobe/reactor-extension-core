import testStringAction from '../../../__tests__/helpers/testStringAction';
import reducer, { actionCreators } from '../domActions';

describe('dom actions', () => {
  it('sets element selector', () => {
    testStringAction(reducer, actionCreators.setElementSelector, 'elementSelector');
  });

  it('sets selected element property preset', () => {
    testStringAction(reducer, actionCreators.setSelectedElementPropertyPreset, 'selectedElementPropertyPreset');
  });

  it('sets custom element property', () => {
    testStringAction(reducer, actionCreators.setCustomElementProperty, 'customElementProperty');
  });
});
