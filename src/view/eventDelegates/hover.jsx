import React from 'react';

import AdvancedEventOptions, { fields as advancedEventOptionsFields } from './components/advancedEventOptions';
import Coral from '../reduxFormCoralUI';
import DelayType, { fields as delayTypeFields, reducers as delayTypeReducers } from './components/delayType';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';
import SpecificElements, { fields as specificElementsFields, reducers as specificElementsReducers } from './components/specificElements';

class EntersViewport extends React.Component {
  render() {
    return (
      <div>
        <SpecificElements fields={this.props.fields}/>
        <DelayType fields={this.props.fields}/>
        <AdvancedEventOptions fields={this.props.fields}/>
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
})(EntersViewport);

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

