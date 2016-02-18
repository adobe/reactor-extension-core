import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';

class NewReturning extends React.Component {
  render() {
    const { visitorType } = this.props.fields;

    return (
      <div>
        <Coral.Radio
          ref="newVisitorRadio"
          {...visitorType}
          value="new"
          checked={visitorType.value === 'new'}>
          New Visitor
        </Coral.Radio>
        <Coral.Radio
          ref="returningVisitorRadio"
          {...visitorType}
          value="returning"
          checked={visitorType.value === 'returning'}>
          Returning Visitor
        </Coral.Radio>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'visitorType'
  ],
  settingsToFormValues(values, options) {
    return {
      visitorType: options.settingsIsNew || options.settings.isNewVisitor ? 'new' : 'returning'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      isNewVisitor: values.visitorType === 'new'
    };
  }
};

export default extensionViewReduxForm(formConfig)(NewReturning);
