import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import CartAmount from '../cartAmount';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const dataElementField = fields.filterWhere(n => n.prop('name') === 'dataElement');
  const dataElementTextfield = dataElementField.find(Textfield).node;
  const dataElementErrorTip = dataElementField.find(ErrorTip).node;
  const amountField = fields.filterWhere(n => n.prop('name') === 'amount');
  const amountTextfield = amountField.find(Textfield).node;
  const amountErrorTip = amountField.find(ErrorTip).node;
  const operatorField = wrapper.find(Select).node;

  return {
    dataElementTextfield,
    dataElementErrorTip,
    operatorField,
    amountTextfield,
    amountErrorTip
  };
};

describe('cart amount view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(CartAmount, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo',
        operator: '=',
        amount: 12.50
      }
    });

    const { dataElementTextfield, operatorField, amountTextfield } = getReactComponents(instance);

    expect(dataElementTextfield.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(amountTextfield.props.value).toBe(12.50);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementTextfield, operatorField, amountTextfield } = getReactComponents(instance);

    dataElementTextfield.props.onChange('foo');
    operatorField.props.onChange({ value: '=' });
    amountTextfield.props.onChange('12.50');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo',
      operator: '=',
      amount: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementErrorTip, amountErrorTip } = getReactComponents(instance);

    expect(dataElementErrorTip).toBeDefined();
    expect(amountErrorTip).toBeDefined();
  });

  it('sets error if amount value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { amountTextfield, amountErrorTip } = getReactComponents(instance);

    amountTextfield.props.onChange('12.abc');

    expect(amountErrorTip).toBeDefined();
  });
});
