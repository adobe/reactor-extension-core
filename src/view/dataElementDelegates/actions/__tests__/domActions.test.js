import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../domActions';

describe('dom actions', () => {
  it('sets element selector', () => {
    testPassThroughAction(reducer, actionCreators.setElementSelector, 'elementSelector');
  });

  it('sets selected element property preset', () => {
    testPassThroughAction(reducer, actionCreators.setSelectedElementPropertyPreset, 'selectedElementPropertyPreset');
  });

  it('sets custom element property', () => {
    testPassThroughAction(reducer, actionCreators.setCustomElementProperty, 'customElementProperty');
  });
});
