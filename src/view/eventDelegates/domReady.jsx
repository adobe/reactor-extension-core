import React from 'react';
import NoConfig from '../components/noConfig';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class DomReady extends React.Component {
  render() {
    return (
      <NoConfig />
    );
  }
}

const fields = [];

export default extensionViewReduxForm({
  fields
})(DomReady);
