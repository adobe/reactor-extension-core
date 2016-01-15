import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';

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

      const { elementPropertiesEditorComponent } = getParts(instance);
      const fields = TestUtils.scryRenderedComponentsWithType(elementPropertiesEditorComponent, Coral.Textfield);

      const name = fields[0].props.value;
      const value = fields[1].props.value;

      expect(name).toBe('someprop');
      expect(value).toBe('somevalue');
    });

    it('sets config from form values', () => {
      extensionBridge.init();

      const { elementFilterComponent } = getParts(instance);
      elementFilterComponent.refs.showElementPropertiesCheckbox.props.onChange(true);

      const { elementPropertiesEditorComponent } = getParts(instance);
      const fields = TestUtils.scryRenderedComponentsWithType(elementPropertiesEditorComponent, Coral.Textfield);
      const name = fields[0].props;
      const value = fields[1].props;

      name.onChange('somepropset');
      value.onChange('somevalueset');

      expect(extensionBridge.getConfig()).toEqual({
        elementProperties: [{
          name: 'somepropset',
          value: 'somevalueset'
        }]
      });
    });
  });
};
