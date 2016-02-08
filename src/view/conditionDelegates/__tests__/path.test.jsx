import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Path, { reducers } from '../path';
import MultipleItemEditor from '../components/multipleItemEditor';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

const testProps = {
  config: {
    paths: [
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

const { instance, extensionBridge } = setUpConnectedForm(Path, reducers);
const getParts = () => {
  return {
    multipleItemEditor: TestUtils.findRenderedComponentWithType(instance, MultipleItemEditor),
    pathFields: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield),
    pathValidationWrappers: TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper),
    regexToggles: TestUtils.scryRenderedComponentsWithType(instance, RegexToggle)
  };
};

describe('path view', () => {
  it('sets form values from config', () => {
    extensionBridge.init(testProps);

    const { pathFields, regexToggles } = getParts();

    expect(pathFields[0].props.value).toBe('foo');
    expect(pathFields[1].props.value).toBe('bar');
    expect(regexToggles[0].props.valueIsRegex).toBeUndefined();
    expect(regexToggles[1].props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { pathFields, regexToggles } = getParts();

    pathFields[0].props.onChange('goo');
    regexToggles[0].props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      paths: [
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

    const { pathFields } = getParts();

    expect(pathFields.length).toBe(3);
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = getParts();

    multipleItemEditor.props.onRemoveItem(1);

    const { pathFields } = getParts();

    expect(pathFields.length).toBe(1);
  });
  
  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pathValidationWrappers } = getParts();

    expect(pathValidationWrappers[0].props.error).toBeDefined();
  });
});
