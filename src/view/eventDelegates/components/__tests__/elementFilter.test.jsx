import TestUtils from 'react-addons-test-utils';
import testElementSelector from './elementSelector.test';

export default (instance, getParts, extensionBridge) => {
  describe('elementFilter', () => {
    describe('when elementSelector is provided', () => {
      beforeEach(() => {
        extensionBridge.init({
          config: {
            elementSelector: 'div#id'
          }
        });
      });

      it('has the specific element radio button selected', () => {
        const { elementFilterComponent } = getParts(instance);
        expect(elementFilterComponent.refs.specificElementsRadio.props.checked).toBe(true);
      });
    });

    describe('when elementSelector is not provided', () => {
      beforeEach(() => {
        extensionBridge.init({config: {}});
      });

      it('has the any element radio button selected', () => {
        const { elementFilterComponent } = getParts(instance);
        expect(elementFilterComponent.refs.anyElementRadio.props.checked).toBe(true);
      });
    });
  });

  testElementSelector(instance, getParts, extensionBridge);
};
