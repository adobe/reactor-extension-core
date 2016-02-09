import React from 'react';
import Coral from '../reduxFormCoralUI';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';
import DelayType, { formConfig as delayTypeFormConfig } from './components/delayType';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

class EntersViewport extends React.Component {
  render() {
    return (
      <div>
        <SpecificElements ref="specificElements" fields={this.props.fields}/>
        <DelayType ref="delayType" fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = {
  fields: specificElementsFormConfig.fields.concat(delayTypeFormConfig.fields),
  validate: reduceReducers(
    specificElementsFormConfig.validate,
    delayTypeFormConfig.validate
  ),
  configToFormValues: reduceReducers(
    specificElementsFormConfig.configToFormValues,
    delayTypeFormConfig.configToFormValues
  ),
  formValuesToConfig: reduceReducers(
    specificElementsFormConfig.formValuesToConfig,
    delayTypeFormConfig.formValuesToConfig
  )
};

export default extensionViewReduxForm(formConfig)(EntersViewport);

