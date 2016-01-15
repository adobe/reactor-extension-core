import TestUtils from 'react-addons-test-utils';

export default (instance, getParts, extensionBridge) => {
  describe('advancedEventOptions', () => {
    beforeEach(() => {
      const { advancedEventOptionsComponent } = getParts(instance);
      advancedEventOptionsComponent.setState({expanded: true});
    });

    it('sets form values from config', () => {
        extensionBridge.init({
          config: {
            bubbleFireIfParent: true,
            bubbleStop: true,
            bubbleFireIfChildFired: true
          }
        });

        const { advancedEventOptionsComponent } = getParts(instance);
        const refs = advancedEventOptionsComponent.refs;

        expect(refs.bubbleFireIfParentCheckbox.props.checked).toBe(true);
        expect(refs.bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
        expect(refs.bubbleStopCheckbox.props.checked).toBe(true);
    });

    it('sets config from form values', () => {
      extensionBridge.init();

      const { advancedEventOptionsComponent } = getParts(instance);
      const refs = advancedEventOptionsComponent.refs;

      refs.bubbleFireIfParentCheckbox.props.onChange(true);
      refs.bubbleFireIfChildFiredCheckbox.props.onChange(true);
      refs.bubbleStopCheckbox.props.onChange(true);

      expect(extensionBridge.getConfig()).toEqual({
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      });
    });
  });
};
