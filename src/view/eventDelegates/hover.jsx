import React from 'react';

import AdvancedEventOptions, { fields as advancedEventOptionsFields } from './components/advancedEventOptions';
import Coral from '../reduxFormCoralUI';
import DelayType, { fields as delayTypeFields, reducers as delayTypeReducers } from './components/delayType';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import SpecificElements, { fields as specificElementsFields, reducers as specificElementsReducers } from './components/specificElements';

export class Hover extends React.Component {
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

const fields = delayTypeFields
  .concat(specificElementsFields)
  .concat(advancedEventOptionsFields);

const validateReducer = reduceReducers(
  specificElementsReducers.validate,
  delayTypeReducers.validate
);

const validate = values => validateReducer({}, values);

export default extensionViewReduxForm({
  fields,
  validate
})(Hover);

export const reducers = {
  configToFormValues: reduceReducers(
    specificElementsReducers.configToFormValues,
    delayTypeReducers.configToFormValues
  ),
  formValuesToConfig: reduceReducers(
    specificElementsReducers.formValuesToConfig,
    delayTypeReducers.formValuesToConfig
  )
};

