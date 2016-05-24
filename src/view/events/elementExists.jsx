import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';
import extensionViewReduxForm from '../extensionViewReduxForm';

class ElementExists extends React.Component {
  render() {
    return <SpecificElements ref="specificElements" fields={this.props.fields}/>;
  }
}

export default extensionViewReduxForm(specificElementsFormConfig)(ElementExists);
