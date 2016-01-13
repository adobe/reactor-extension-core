import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';

const getParts = component => {
  const radios = TestUtils.scryRenderedComponentsWithType(component, Coral.Radio);
  return {
    specificElementFields: component.refs.specificElementFields,
    elementPropertiesEditor: component.refs.elementPropertiesEditor,
    specificElementsRadio: radios[0],
    anyElementRadio: radios[1]
  };
};

export default (subcomponent, extensionBridge) => {
  describe('element filter', () => {
    describe('when selector is provided', () => {
      it('has the specific element filed selected', () => {
        extensionBridge.init({
          config: {
            elementSelector: 'div#id'
          }
        });

        const { specificElementsRadio } = getParts(subcomponent);
        expect(specificElementsRadio.props.checked).toBe(true);
      });
    });
  });
};
