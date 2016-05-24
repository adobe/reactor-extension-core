import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';

class CookieOptOut extends React.Component {
  render() {
    const { acceptsCookies } = this.props.fields;
    return <Coral.Checkbox ref="acceptCookiesCheckbox" {...acceptsCookies}>
      User accepts cookies (EU)
    </Coral.Checkbox>;
  }
}

const formConfig = {
  fields: [
    'acceptsCookies'
  ]
};

export default extensionViewReduxForm(formConfig)(CookieOptOut);
