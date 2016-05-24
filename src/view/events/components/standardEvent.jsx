import React from 'react';
import ElementFilter, { formConfig as elementFilterFormConfig } from './elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './advancedEventOptions';
import reduceReducers from 'reduce-reducers';
import extensionViewReduxForm from '../../extensionViewReduxForm';

class StandardEvent extends React.Component {
  render() {
    return (
      <div>
        <ElementFilter ref="elementFilter" fields={this.props.fields}/>
        <AdvancedEventOptions ref="advancedEventOptions" fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = {
  fields: elementFilterFormConfig.fields.concat(advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues
  ),
  formValuesToSettings: elementFilterFormConfig.formValuesToSettings,
  validate: elementFilterFormConfig.validate
};

export default extensionViewReduxForm(formConfig)(StandardEvent);
