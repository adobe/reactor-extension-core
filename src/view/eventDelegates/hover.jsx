import React from 'react';

import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import DelayType, { formConfig as delayTypeFormConfig } from './components/delayType';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';

class Hover extends React.Component {
  render() {
    return (
      <div>
        <SpecificElements ref="specificElements" fields={this.props.fields}/>
        <DelayType ref="delayType" fields={this.props.fields}/>
        <AdvancedEventOptions ref="advancedEventOptions" fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = {
  fields: delayTypeFormConfig.fields
    .concat(specificElementsFormConfig.fields, advancedEventOptionsFormConfig.fields),
  configToFormValues: reduceReducers(
    specificElementsFormConfig.configToFormValues,
    delayTypeFormConfig.configToFormValues
  ),
  formValuesToConfig: reduceReducers(
    specificElementsFormConfig.formValuesToConfig,
    delayTypeFormConfig.formValuesToConfig
  ),
  validate: reduceReducers(
    specificElementsFormConfig.validate,
    delayTypeFormConfig.validate
  )
};

export default extensionViewReduxForm(formConfig)(Hover);

