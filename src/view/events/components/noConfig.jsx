import React from 'react';
import extensionViewReduxForm from '../../extensionViewReduxForm';
import Alert from '@coralui/react-coral/lib/Alert';

const NoConfig = () => (
  <Alert header="INFO">
    This delegate doesn't have any configuration properties.
  </Alert>
);

const formConfig = {
  fields: []
};

export default extensionViewReduxForm(formConfig)(NoConfig);
