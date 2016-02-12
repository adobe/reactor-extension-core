import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Subdomain from '../subdomain';

const testProps = {
  config: {
    subdomains: [
      {
        value: 'foo'
      },
      {
        value: 'bar',
        valueIsRegex: true
      }
    ]
  }
};

const { instance, extensionBridge } = setUpConnectedForm(Subdomain);

describe('subdomain view', () => {
  it('sets form values from config', () => {
    extensionBridge.init(testProps);

    const {
      subdomainField0,
      subdomainField1,
      subdomainRegexToggle0,
      subdomainRegexToggle1
    } = instance.refs.multipleItemEditor.refs;

    expect(subdomainField0.props.value).toBe('foo');
    expect(subdomainField1.props.value).toBe('bar');
    expect(subdomainRegexToggle0.props.valueIsRegex).toBeUndefined();
    expect(subdomainRegexToggle1.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const {
      subdomainField0,
      subdomainRegexToggle0
    } = instance.refs.multipleItemEditor.refs;

    subdomainField0.props.onChange('goo');
    subdomainRegexToggle0.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      subdomains: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('adds a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = instance.refs;

    multipleItemEditor.props.onAddItem();

    const {
      subdomainField0,
      subdomainField1,
      subdomainField2,
      subdomainField3
    } = instance.refs.multipleItemEditor.refs;

    expect(subdomainField0).toBeDefined();
    expect(subdomainField1).toBeDefined();
    expect(subdomainField2).toBeDefined();
    expect(subdomainField3).toBeUndefined();
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = instance.refs;

    multipleItemEditor.props.onRemoveItem(1);

    const {
      subdomainField0,
      subdomainField1
    } = instance.refs.multipleItemEditor.refs;

    expect(subdomainField0).toBeDefined();
    expect(subdomainField1).toBeUndefined();
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { subdomainWrapper0 } = instance.refs.multipleItemEditor.refs;

    expect(subdomainWrapper0.props.error).toBeDefined();
  });
});
