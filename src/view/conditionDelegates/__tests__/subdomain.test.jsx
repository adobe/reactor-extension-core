import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Subdomain from '../subdomain';
import MultipleItemEditor from '../components/multipleItemEditor';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

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
const getParts = () => {
  return {
    multipleItemEditor: TestUtils.findRenderedComponentWithType(instance, MultipleItemEditor),
    subdomainFields: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield),
    subdomainValidationWrappers:
      TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper),
    regexToggles: TestUtils.scryRenderedComponentsWithType(instance, RegexToggle)
  };
};

describe('subdomain view', () => {
  it('sets form values from config', () => {
    extensionBridge.init(testProps);

    const { subdomainFields, regexToggles } = getParts();

    expect(subdomainFields[0].props.value).toBe('foo');
    expect(subdomainFields[1].props.value).toBe('bar');
    expect(regexToggles[0].props.valueIsRegex).toBeUndefined();
    expect(regexToggles[1].props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { subdomainFields, regexToggles } = getParts();

    subdomainFields[0].props.onChange('goo');
    regexToggles[0].props.onValueIsRegexChange(true);

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

    const { multipleItemEditor } = getParts();

    multipleItemEditor.props.onAddItem();

    const { subdomainFields } = getParts();

    expect(subdomainFields.length).toBe(3);
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = getParts();

    multipleItemEditor.props.onRemoveItem(1);

    const { subdomainFields } = getParts();

    expect(subdomainFields.length).toBe(1);
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { subdomainValidationWrappers } = getParts();

    expect(subdomainValidationWrappers[0].props.error).toBeDefined();
  });
});
