import React from 'react';
import Coral from '../reduxFormCoralUI';
import SpecificElements, {
  fields as specificElementsFields,
  reducers as specificElementsReducers
} from './components/specificElements';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class ElementExists extends React.Component {
  render() {
    return <SpecificElements ref="specificElements" fields={this.props.fields}/>;
  }
}

const fields = specificElementsFields;

const validate = values => specificElementsReducers.validate({}, values);

export default extensionViewReduxForm({
  fields,
  validate
})(ElementExists);

export const reducers = specificElementsReducers;
