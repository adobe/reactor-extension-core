import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import PreviousConverter from '../previousConverter';
import ValidationWrapper from '../../components/validationWrapper';
import DataElementNameField from '../components/dataElementNameField';

const { instance, extensionBridge } = setUpComponent(PreviousConverter);
const getParts = () => {
  return {
    dataElementField: TestUtils.findRenderedComponentWithType(instance, DataElementNameField),
    dataElementValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper)
  };
};

describe('previous converter view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        dataElement: 'foo'
      }
    });

    const { dataElementField } = getParts();

    expect(dataElementField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { dataElementField } = getParts();

    dataElementField.props.onChange('foo');

    expect(extensionBridge.getConfig()).toEqual({
      dataElement: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      dataElementValidationWrapper
    } = getParts();

    expect(dataElementValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
