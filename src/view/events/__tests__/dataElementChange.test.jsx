import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createExtensionBridge from '@test-helpers/createExtensionBridge';
import DataElementChange, { formConfig } from '../dataElementChange';
import bootstrap from '../../bootstrap';

// react-testing-library element selectors
const pageElements = {
  getDataElementNameTextBox: () => {
    return screen.getByRole('textbox', { name: /data element name/i });
  },
  getDataElementModalTrigger: () => {
    return screen.getByRole('button', { name: /select a data element/i });
  },
  getWarningMessage: () => {
    return screen.getByText(
      /this event type polls the data element value to determine/i
    );
  }
};

describe('dataElementChange event view', () => {
  let extensionBridge;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    render(bootstrap(DataElementChange, formConfig));
    extensionBridge.init();
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('sets settings from form values', () => {
    fireEvent.focus(pageElements.getDataElementNameTextBox());
    userEvent.type(
      pageElements.getDataElementNameTextBox(),
      'Data Element Name'
    );
    fireEvent.blur(pageElements.getDataElementNameTextBox());

    expect(extensionBridge.validate()).toBeTrue();
    expect(
      pageElements.getDataElementNameTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
    expect(extensionBridge.getSettings().name).toBe('Data Element Name');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'Data Element Name'
      }
    });

    expect(pageElements.getDataElementNameTextBox().value).toBe(
      'Data Element Name'
    );
    expect(
      pageElements.getDataElementNameTextBox().hasAttribute('aria-invalid')
    ).toBeFalse();
  });

  it('supports opening the data element modal', () => {
    spyOn(extensionBridge, 'openDataElementSelector').and.callFake(() => {
      return Promise.resolve();
    });

    fireEvent.click(pageElements.getDataElementModalTrigger());
    expect(extensionBridge.openDataElementSelector).toHaveBeenCalledTimes(1);
  });

  it('shows as invalid if the field is left blank', () => {
    fireEvent.focus(pageElements.getDataElementNameTextBox());
    fireEvent.blur(pageElements.getDataElementNameTextBox());
    expect(
      pageElements.getDataElementNameTextBox().hasAttribute('aria-invalid')
    ).toBeTrue();
    expect(extensionBridge.validate()).toBeFalse();
  });

  it('shows the warnig mesage', () => {
    expect(pageElements.getWarningMessage()).toBeTruthy();
  });
});
