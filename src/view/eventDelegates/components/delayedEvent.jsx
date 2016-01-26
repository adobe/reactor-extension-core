import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementFilter, {
  fields as elementFilterFields,
  reducers as elementFilterReducers
} from './elementFilter';
import AdvancedEventOptions, {
  fields as advancedEventOptionsFields
} from './advancedEventOptions';
import DelayType, {
  fields as delayTypeFields,
  reducers as delayTypeReducers
} from './delayType';
import extensionViewReduxForm from '../../extensionViewReduxForm';
import reduceReducers from 'reduce-reducers';

class DelayEvent extends React.Component {
  render() {
    return (
      <div>
        <DelayType {...this.props.fields}/>
        <ElementFilter {...this.props.fields}/>
        <AdvancedEventOptions {...this.props.fields}/>
      </div>
    );
  }
}

const fields = elementFilterFields
  .concat(advancedEventOptionsFields)
  .concat(delayTypeFields);

const validate = values => {
  return {
    ...elementFilterReducers.validate({}, values),
    ...delayTypeReducers.validate({}, values)
  };
};

export default extensionViewReduxForm({
  fields,
  validate
})(DelayEvent);

export const reducers = {
  configToFormValues: reduceReducers(
    elementFilterReducers.configToFormValues,
    delayTypeReducers.configToFormValues
  ),
  formValuesToConfig: reduceReducers(
    elementFilterReducers.formValuesToConfig,
    delayTypeReducers.formValuesToConfig
  )
};
