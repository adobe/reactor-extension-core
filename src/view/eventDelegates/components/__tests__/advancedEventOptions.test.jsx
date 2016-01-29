import TestUtils from 'react-addons-test-utils';

export default (instance, getParts, extensionBridge) => {
  let { advancedEventOptionsComponent } = getParts(instance);

  describe('advancedEventOptions', () => {
    beforeEach(() => {
      advancedEventOptionsComponent.toggleSelected();
    });

    afterEach(() => {
      advancedEventOptionsComponent.toggleSelected();
    });

    it('sets form values from config', () => {
        extensionBridge.init({
          config: {
            bubbleFireIfParent: true,
            bubbleStop: true,
            bubbleFireIfChildFired: true
          }
        });

        const refs = advancedEventOptionsComponent.refs;

        expect(refs.bubbleFireIfParentCheckbox.props.checked).toBe(true);
        expect(refs.bubbleFireIfChildFiredCheckbox.props.checked).toBe(true);
        expect(refs.bubbleStopCheckbox.props.checked).toBe(true);
    });

    it('sets config from form values', () => {
      extensionBridge.init();

      const refs = advancedEventOptionsComponent.refs;

      refs.bubbleFireIfParentCheckbox.props.onChange(true);
      refs.bubbleFireIfChildFiredCheckbox.props.onChange(true);
      refs.bubbleStopCheckbox.props.onChange(true);

      const { bubbleFireIfParent, bubbleStop, bubbleFireIfChildFired } =
        extensionBridge.getConfig();

      expect({
        bubbleFireIfParent,
        bubbleStop,
        bubbleFireIfChildFired
      }).toEqual({
        bubbleFireIfParent: true,
        bubbleStop: true,
        bubbleFireIfChildFired: true
      });
    });
  });
};
