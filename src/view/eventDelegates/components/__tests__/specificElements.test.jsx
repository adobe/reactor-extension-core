import TestUtils from 'react-addons-test-utils';
import testElementSelector from './elementSelectorField.test';

export default (instance, getParts, extensionBridge) => {
  describe('specificElements', () => {
    describe('when elementProperties is provided', () => {
      beforeEach(() => {
        extensionBridge.init({
          config: {
            elementSelector: 'div#id',
            elementProperties: [
              {
                name: 'a',
                value: 'b'
              }
            ]
          }
        });
      });

      it('has the element properties checkbox selected and shows element properties editor', () => {
        const { specificElementsComponent } = getParts(instance);
        expect(specificElementsComponent.refs.showElementPropertiesCheckbox.props.checked)
          .toBe(true);
        expect(specificElementsComponent.refs.elementPropertiesEditor).toBeDefined();
      });
    });

    describe('when elementProperties is not provided', () => {
      beforeEach(() => {
        extensionBridge.init({config: {
          elementSelector: 'div#id'
        }});
      });

      it('does not have element properties checkbox selected and ' +
        'does not show element properties editor', () => {
        const { specificElementsComponent } = getParts(instance);
        expect(specificElementsComponent.refs.showElementPropertiesCheckbox.props.checked)
          .toBe(false);
        expect(specificElementsComponent.refs.elementPropertiesEditor).toBeUndefined();
      });
    });
  });

  testElementSelector(instance, getParts, extensionBridge);
};
