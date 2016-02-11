import TestUtils from 'react-addons-test-utils';

import Sessions from '../sessions';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Sessions);

describe('sessions view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = instance.refs;

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        operator: '=',
        count: 100
      }
    });

    const { operatorField, countField } = instance.refs;

    expect(operatorField.props.value).toBe('=');
    expect(countField.props.value).toBe(100);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatorField, countField } = instance.refs;

    operatorField.props.onChange('=');
    countField.props.onChange(100);

    expect(extensionBridge.getConfig()).toEqual({
      operator: '=',
      count: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countWrapper } = instance.refs;

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countField, countWrapper } = instance.refs;

    countField.props.onChange('12.abc');

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });
});
