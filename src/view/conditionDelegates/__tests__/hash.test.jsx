import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Hash from '../hash';
import MultipleItemEditor from '../components/multipleItemEditor';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

const testProps = {
  config: {
    hashes: [
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

const { instance, extensionBridge } = setUpConnectedForm(Hash);
const getParts = () => {
  return {
    multipleItemEditor: TestUtils.findRenderedComponentWithType(instance, MultipleItemEditor),
    hashFields: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield),
    hashValidationWrappers: TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper),
    regexToggles: TestUtils.scryRenderedComponentsWithType(instance, RegexToggle)
  };
};

describe('hash view', () => {
  it('sets form values from config', () => {
    extensionBridge.init(testProps);

    const { hashFields, regexToggles } = getParts();

    expect(hashFields[0].props.value).toBe('foo');
    expect(hashFields[1].props.value).toBe('bar');
    expect(regexToggles[0].props.valueIsRegex).toBeUndefined();
    expect(regexToggles[1].props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { hashFields, regexToggles } = getParts();

    hashFields[0].props.onChange('goo');
    regexToggles[0].props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      hashes: [
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

    const { hashFields } = getParts();

    expect(hashFields.length).toBe(3);
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = getParts();

    multipleItemEditor.props.onRemoveItem(1);

    const { hashFields } = getParts();

    expect(hashFields.length).toBe(1);
  });
  
  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { hashValidationWrappers } = getParts();

    expect(hashValidationWrappers[0].props.error).toBeDefined();
  });
});
