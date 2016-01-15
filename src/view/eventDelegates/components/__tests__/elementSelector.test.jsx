import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';

export default (instance, getParts, extensionBridge) => {
  describe('elementSelector', () => {
    describe('sets form values from config when `elementSelector` key is provided', () => {
      beforeEach(() => {
        extensionBridge.init({
          config: {
            elementSelector: 'div#id'
          }
        });
      });

      it('has the specific element field value set', () => {
        const { elementSelectorComponent } = getParts(instance);
        expect(elementSelectorComponent.refs.elementSelectorField.props.value).toBe('div#id');
      });
    });

    describe('sets form values from config when `elementSelector` key is not provided', () => {
      beforeEach(() => {
        // Calling `extensionBridge.init` without any parameters renders the form which by default
        // will containg the elementSelectorComponent. This is why we need to call here with an empty
        // config.
        extensionBridge.init({config: {}});
      });

      it('the specific element field is not visible', () => {
        const { elementSelectorComponent } = getParts(instance);
        expect(elementSelectorComponent).toBeUndefined();
      });
    });

    describe('sets config from form values', () => {
      beforeEach(() => {
        extensionBridge.init();
      });

      it('sets elementSelector in config', () => {
        const { elementSelectorComponent } = getParts(instance);
        elementSelectorComponent.refs.elementSelectorField.props.onChange('div#some_selector');

        expect(extensionBridge.getConfig()).toEqual({
          elementSelector: 'div#some_selector'
        });
      });
    });

    it('sets error if element selector field is empty', () => {
      extensionBridge.init();

      expect(extensionBridge.validate()).toBe(false);

      const { errorIcon } = getParts(instance);

      expect(errorIcon.props.message).toBeDefined();
    });
  });
};
