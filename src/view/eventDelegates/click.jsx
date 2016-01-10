import React from 'react';
import Coral from '../reduxFormCoralUI';
import ElementFilter, {
  fields as elementFilterFields,
  reducers as elementFilterReducers
} from './components/elementFilter';
import AdvancedEventOptions, {
  fields as advancedEventOptionsFields,
  reducers as advancedEventOptionsReducers
} from './components/advancedEventOptions';
import extensionReduxForm from '../extensionReduxForm';
import reduceReducers from 'reduce-reducers';

const fields = [
  'delayLinkActivation'
]
.concat(elementFilterFields)
.concat(advancedEventOptionsFields);

export class Click extends React.Component {
  render() {
    const { fields: { delayLinkActivation } } = this.props;

    return (
      <div>
        <ElementFilter {...this.props.fields}/>
        <Coral.Checkbox
          class="u-block"
          {...delayLinkActivation}>
          If the element is a link, delay navigation until rule runs
        </Coral.Checkbox>
        <AdvancedEventOptions {...this.props.fields}/>
      </div>
    );
  }
}

let validate = values => elementFilterReducers.validate({}, values);

export default extensionReduxForm({
  fields,
  validate
})(Click);

export let reducers = {
  toValues: reduceReducers(
    elementFilterReducers.toValues,
    advancedEventOptionsReducers.toValues,
    (values, options) => {
      const { delayLinkActivation } = options.config;
      return {
        ...values,
        delayLinkActivation
      };
    }
  ),
  toConfig: reduceReducers(
    elementFilterReducers.toConfig,
    advancedEventOptionsReducers.toConfig,
    (config, values) => {
      config = {
        ...config
      };

      if (values.delayLinkActivation) {
        config.delayLinkActivation = true;
      }

      return config;
    }
  )
};
