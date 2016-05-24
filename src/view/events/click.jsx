import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

class Click extends React.Component {
  render() {
    const { delayLinkActivation } = this.props.fields;

    return (
      <div>
        <ElementFilter ref="elementFilter" fields={this.props.fields}/>
        <Coral.Checkbox
          ref="delayLinkActivationCheckbox"
          className="u-block"
          {...delayLinkActivation}>
          If the element is a link, delay navigation until rule runs
        </Coral.Checkbox>
        <AdvancedEventOptions ref="advancedEventOptions" fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'delayLinkActivation'
  ].concat(elementFilterFormConfig.fields, advancedEventOptionsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    elementFilterFormConfig.settingsToFormValues,
    advancedEventOptionsFormConfig.settingsToFormValues
  ),
  formValuesToSettings: elementFilterFormConfig.formValuesToSettings,
  validate: elementFilterFormConfig.validate
};

export default extensionViewReduxForm(formConfig)(Click);
