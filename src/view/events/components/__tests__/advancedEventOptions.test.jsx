import extensionViewReduxForm from '../../../extensionViewReduxForm';
import { mount } from 'enzyme';
import AdvancedEventOptions, { formConfig } from '../advancedEventOptions';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

const getReactComponents = (wrapper) => {
  const bubbleFireIfParentCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleFireIfParent').node;
  const bubbleFireIfChildFiredCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleFireIfChildFired').node;
  const bubbleStopCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;

  return {
    bubbleFireIfParentCheckbox,
    bubbleFireIfChildFiredCheckbox,
    bubbleStopCheckbox
  };
};

describe('advancedEventOptions', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(AdvancedEventOptions);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  beforeEach(() => {
    instance.find(AdvancedEventOptions).node.toggleSelected();
  });

  afterEach(() => {
    instance.find(AdvancedEventOptions).node.toggleSelected();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      }
    });

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
    expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
    expect(bubbleStopCheckbox.props.checked).toBe(true);
  });

  it('has bubbleFireIfParent set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const {
      bubbleFireIfParentCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfParentCheckbox.props.checked).toBe(true);
  });

  it('has bubbleFireIfChildFired set to true by default', () => {
    extensionBridge.init({
      settings: {}
    });

    const {
      bubbleFireIfChildFiredCheckbox
    } = getReactComponents(instance);

    expect(bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
  });


  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      bubbleFireIfParentCheckbox,
      bubbleFireIfChildFiredCheckbox,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    bubbleFireIfParentCheckbox.props.onChange(true);
    bubbleFireIfChildFiredCheckbox.props.onChange(true);
    bubbleStopCheckbox.props.onChange(true);

    const {
      bubbleFireIfParent,
      bubbleStop,
      bubbleFireIfChildFired
    } = extensionBridge.getSettings();

    expect(bubbleFireIfParent).toBe(true);
    expect(bubbleStop).toBe(true);
    expect(bubbleFireIfChildFired).toBe(true);
  });
});
