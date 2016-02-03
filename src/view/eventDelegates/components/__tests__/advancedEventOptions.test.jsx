import TestUtils from 'react-addons-test-utils';
import setUpComponent from '../../../__tests__/helpers/setUpComponent';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import AdvancedEventOptions, { fields, reducers } from '../advancedEventOptions';

const FormComponent = extensionViewReduxForm({
  fields
})(AdvancedEventOptions);

let { instance, extensionBridge } = setUpComponent(FormComponent, reducers);

instance = TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions);

describe('advancedEventOptions', () => {
  beforeEach(() => {
    instance.toggleSelected();
  });

  afterEach(() => {
    instance.toggleSelected();
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      }
    });

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = instance.refs;

    expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
    expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
    expect(bubbleStopCheckbox.props.checked).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = instance.refs;

    bubbleFireIfParentCheckbox.props.onChange(true);
    bubbleFireIfChildFiredCheckbox.props.onChange(true);
    bubbleStopCheckbox.props.onChange(true);

    const {
      bubbleFireIfParent,
      bubbleStop,
      bubbleFireIfChildFired
    } = extensionBridge.getConfig();

    expect(bubbleFireIfParent).toBe(true);
    expect(bubbleStop).toBe(true);
    expect(bubbleFireIfChildFired).toBe(true);
  });
});
