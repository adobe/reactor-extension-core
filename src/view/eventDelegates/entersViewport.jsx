import React from 'react';
import Coral from '../reduxFormCoralUI';
import SpecificElements, {
  fields as specificElementsFields,
  reducers as specificElementsReducers
} from './components/specificElements';
import DelayType, {
  fields as delayTypeFields,
  reducers as delayTypeReducers
} from './components/delayType';
import extensionViewReduxForm from '../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

export class EntersViewport extends React.Component {
  render() {
    return (
      <div>
        <SpecificElements ref="specificElements" fields={this.props.fields}/>
        <DelayType ref="delayType" fields={this.props.fields}/>
      </div>
    );
  }
}

const fields = specificElementsFields.concat(delayTypeFields);

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

