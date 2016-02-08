import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import EntersViewport, { reducers } from '../entersViewport';

const { instance, extensionBridge } = setUpConnectedForm(EntersViewport, reducers);

describe('enters viewport view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        delay: 100
      }
    });

    const { specificElements, delayType } = instance.refs;

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
    expect(delayType.props.fields.delay.value).toBe(100);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { specificElements, delayType } = instance.refs;

    specificElements.props.fields.elementSelector.onChange('.foo');
    delayType.props.fields.delayType.onChange('delay');
    delayType.props.fields.delay.onChange(100);

    const { elementSelector, delay } = extensionBridge.getConfig();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { specificElements, delayType } = instance.refs;

    delayType.props.fields.delayType.onChange('delay');

    expect(extensionBridge.validate()).toBe(false);

    expect(delayType.props.fields.delay.error).toEqual(jasmine.any(String));
    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
