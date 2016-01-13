import React from 'react';
import Coral from '../reduxFormCoralUI';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class Domain extends React.Component {
  render() {
    const { domains } = this.props.fields;
    return <CheckboxList options={this.props.domainOptions} {...domains}/>
  }
}

const fields = ['domains'];

const stateToProps = state => {
  return {
    domainOptions: state.propertyConfig ? state.propertyConfig.domainList : []
  };
};

export default extensionViewReduxForm(
  {
    fields
  },
  stateToProps
)(Domain);

export const reducers = {
  stateToConfig(config, values) {
    return {
      domains: values.domains || [] // An array is required.
    }
  }
};
