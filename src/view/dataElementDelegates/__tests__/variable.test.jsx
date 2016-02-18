import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Variable from '../variable';

const { instance, extensionBridge } = setUpConnectedForm(Variable);

describe('variable view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        path: 'foo'
      }
    });

    const { pathField } = instance.refs;

    expect(pathField.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pathField } = instance.refs;

    pathField.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      path: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { pathWrapper } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(pathWrapper.props.error).toEqual(jasmine.any(String));
  });
});
