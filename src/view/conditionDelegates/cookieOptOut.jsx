import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class CookieOptOut extends React.Component {
  render() {
    const { acceptsCookies } = this.props.fields;
    return <Coral.Checkbox {...acceptsCookies}>User accepts cookies (EU)</Coral.Checkbox>
  }
}

const fields = [
  'acceptsCookies'
];

export default extensionViewReduxForm({
  fields
})(CookieOptOut);
