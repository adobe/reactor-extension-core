import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';

const getEditorFields = (instance, getParts) => {
  const { elementFilterComponent } = getParts(instance);
  elementFilterComponent.refs.showElementPropertiesCheckbox.props.onChange(true);
  const { elementPropertiesEditorComponent } = getParts(instance);
  const fields = TestUtils.scryRenderedComponentsWithType(elementPropertiesEditorComponent, Coral.Textfield);
  return {
    nameField: fields[0].props,
    valueField: fields[1].props
  };
};

export default (instance, getParts, extensionBridge) => {
  describe('elementPropertiesEditor', () => {
    it('sets form values from config', () => {
      extensionBridge.init({
        config: {
          elementProperties:[{
            name: "someprop",
            value: "somevalue"
          }]
        }
      });

      const { nameField, valueField } = getEditorFields(instance, getParts);

      expect(nameField.value).toBe('someprop');
      expect(valueField.value).toBe('somevalue');
    });

    it('sets config from form values', () => {
      extensionBridge.init();

      const { nameField, valueField } = getEditorFields(instance, getParts);

      nameField.onChange('somepropset');
      valueField.onChange('somevalueset');

      expect(extensionBridge.getConfig()).toEqual({
        elementProperties: [{
          name: 'somepropset',
          value: 'somevalueset'
        }]
      });
    });

    it('sets error if element property name field is empty', () => {
      const { nameField, valueField } = getEditorFields(instance, getParts);

      valueField.onChange('somevalueset');
      expect(extensionBridge.validate()).toBe(false);

      const { errorIcon } = getParts(instance);
      expect(errorIcon.props.message).toBeDefined();
    });
  });
};
