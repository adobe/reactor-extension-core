import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import NewReturning, { reducers } from '../newReturning';

const { instance, extensionBridge } = setUpComponent(NewReturning, reducers);
const getParts = () => {
  const radios = TestUtils.scryRenderedComponentsWithType(instance, Coral.Radio);
  return {
    newRadio: radios[0],
    returningRadio: radios[1]
  };
};

describe('new/returning visitor view', () => {
  it('sets new visitor radio as checked by default', () => {
    extensionBridge.init();

    const { newRadio, returningRadio } = getParts();

    expect(newRadio.props.checked).toBe(true);
    expect(returningRadio.props.checked).toBe(false);
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        isNewVisitor: false
      }
    });

    const { newRadio, returningRadio } = getParts();

    expect(newRadio.props.checked).toBe(false);
    expect(returningRadio.props.checked).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { returningRadio } = getParts();

    returningRadio.props.onChange('returning');

    expect(extensionBridge.getConfig()).toEqual({
      isNewVisitor: false
    });
  });
});
