import React from 'react';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';
import extensionViewReduxForm from '../extensionViewReduxForm';

const ElementExists = () => (
  <SpecificElements />
);


export default extensionViewReduxForm(specificElementsFormConfig)(ElementExists);
