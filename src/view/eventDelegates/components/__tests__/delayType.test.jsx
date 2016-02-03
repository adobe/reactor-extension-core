export default (instance, getParts, extensionBridge) => {
  describe('delayType', () => {
    describe('sets form values', () => {
      it('when config contains delay value', () => {
        extensionBridge.init({
          config: {
            delay: 500
          }
        });
        const { delayTypeComponent } = getParts(instance);
        expect(delayTypeComponent.refs.delayRadio.props.checked).toBe(true);
        expect(delayTypeComponent.refs.delayTextField.props.value).toBe(500);
      });

      it('when config doesn\'t contain delay value', () => {
        extensionBridge.init({config: {}});
        const { delayTypeComponent } = getParts(instance);
        expect(delayTypeComponent.refs.immediatelyRadio.props.checked).toBe(true);
      });
    });

    it('has the specific element radio button selected', () => {
      extensionBridge.init();
      const { delayTypeComponent } = getParts(instance);
      expect(delayTypeComponent.refs.immediatelyRadio.props.checked).toBe(true);
    });

    it('sets config from form values', () => {
      extensionBridge.init();

      const { delayTypeComponent } = getParts(instance);
      delayTypeComponent.refs.delayRadio.props.onChange('delay');
      delayTypeComponent.refs.delayTextField.props.onChange(100);

      expect(extensionBridge.getConfig()).toEqual({
        delay: 100
      });
    });

    it('sets config without delay when trigger immediately is selected and delay ' +
      'contains a value', () => {
      extensionBridge.init();

      const { delayTypeComponent } = getParts(instance);
      delayTypeComponent.refs.delayTextField.props.onChange(100);
      delayTypeComponent.refs.immediatelyRadio.props.onChange('immediately');

      expect(extensionBridge.getConfig().delay).toBeUndefined();
    });

    it('sets error if delay radio is selected and the delay field is empty', () => {
      extensionBridge.init();

      const { delayTypeComponent } = getParts(instance);
      delayTypeComponent.refs.delayRadio.props.onChange('delay');

      expect(extensionBridge.validate()).toBe(false);
      expect(delayTypeComponent.refs.delayValidationWrapper.props.error)
        .toEqual(jasmine.any(String));
    });

    it('sets error if the delay field is not a number', () => {
      extensionBridge.init();

      const { delayTypeComponent } = getParts(instance);
      delayTypeComponent.refs.delayRadio.props.onChange('delay');
      delayTypeComponent.refs.delayTextField.props.onChange('aaa');

      expect(extensionBridge.validate()).toBe(false);
      expect(delayTypeComponent.refs.delayValidationWrapper.props.error)
        .toEqual(jasmine.any(String));
    });
  });
};
