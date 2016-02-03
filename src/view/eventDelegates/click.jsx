import React from 'react';
import Coral from '../reduxFormCoralUI';
import ElementFilter, {
  fields as elementFilterFields,
  reducers as elementFilterReducers
} from './components/elementFilter';
import AdvancedEventOptions, {
  fields as advancedEventOptionsFields
} from './components/advancedEventOptions';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class Click extends React.Component {
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

const fields = [
  'delayLinkActivation'
]
.concat(elementFilterFields)
.concat(advancedEventOptionsFields);

const validate = values => elementFilterReducers.validate({}, values);

export default extensionViewReduxForm({
  fields,
  validate
})(Click);

export const reducers = elementFilterReducers;
