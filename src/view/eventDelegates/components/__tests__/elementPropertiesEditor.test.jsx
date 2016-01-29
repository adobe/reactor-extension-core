import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';
import ValidationWrapper from '../../../components/validationWrapper';
import ElementPropertyEditor from '../../components/elementPropertyEditor';

const makeEditorVisible = (instance, getParts) => {
  const { elementFilterComponent } = getParts(instance);
  elementFilterComponent.refs.showElementPropertiesCheckbox.props.onChange(true);
};

const getEditorFields = (instance, getParts) => {
  makeEditorVisible(instance, getParts);

  const { elementPropertiesEditorComponent } = getParts(instance);
  const fields =
    TestUtils.scryRenderedComponentsWithType(elementPropertiesEditorComponent, Coral.Textfield);

  return {
    nameField: fields[0].props,
    valueField: fields[1].props
  };
};

const getValidationWrapperOnFirstRow = (instance, getParts) => {
  const { elementPropertiesEditorComponent } = getParts(instance);

  const editorRows = TestUtils.scryRenderedComponentsWithType(
    elementPropertiesEditorComponent,
    ElementPropertyEditor
  );

  return TestUtils.findRenderedComponentWithType(editorRows[0], ValidationWrapper);
};

const clickRemoveButtonOnFirstRow = (instance, getParts) => {
  const { elementPropertiesEditorComponent } = getParts(instance);

  const editorRows = TestUtils.scryRenderedComponentsWithType(
    elementPropertiesEditorComponent,
    ElementPropertyEditor
  );

  const firstRowRemoveButton = editorRows[0].refs.removeButton;
  firstRowRemoveButton.props.onClick();
};

const countEditorRows = (instance, getParts) => {
  const { elementPropertiesEditorComponent } = getParts(instance);
  const fields =
    TestUtils.scryRenderedComponentsWithType(elementPropertiesEditorComponent, Coral.Textfield);

  // Two inputs for each visible row.
  return fields.length / 2;
};

const clickAddButton = (instance, getParts) => {
  const { elementPropertiesEditorComponent } = getParts(instance);

  const addButton = elementPropertiesEditorComponent.refs.addButton;
  addButton.props.onClick();
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

      const { elementProperties } = extensionBridge.getConfig();
      expect({elementProperties}).toEqual({
        elementProperties: [{
          name: 'somepropset',
          value: 'somevalueset'
        }]
      });
    });

    it('sets error if element property name field is empty', () => {
      extensionBridge.init();

      const { valueField } = getEditorFields(instance, getParts);

      valueField.onChange('somevalueset');
      expect(extensionBridge.validate()).toBe(false);

      const validationWrapper = getValidationWrapperOnFirstRow(instance, getParts);
      expect(validationWrapper.props.error).toEqual(jasmine.any(String));
    });

    it('creates a new row when the add button is clicked', () => {
      extensionBridge.init();
      makeEditorVisible(instance, getParts);
      clickAddButton(instance, getParts);

      // First row is visible by default.
      expect(countEditorRows(instance, getParts)).toBe(2);
    });

    it('deletes a row when delete button is clicked', () => {
      extensionBridge.init();
      makeEditorVisible(instance, getParts);
      clickAddButton(instance, getParts);
      clickRemoveButtonOnFirstRow(instance, getParts);

      expect(countEditorRows(instance, getParts)).toBe(1);
    });
  });
};
