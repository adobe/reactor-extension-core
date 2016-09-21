import React from 'react';

import ElementFilter, { formConfig as elementFilterFormConfig } from './elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './advancedEventOptions';
import extensionViewReduxForm from '../../extensionViewReduxForm';
import mergeFormConfigs from '../../utils/mergeFormConfigs';

const StandardEvent = ({ ...props }) => (
  <div>
    <ElementFilter fields={ props.fields } />
    <AdvancedEventOptions fields={ props.fields } />
  </div>
);

const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig
);

export default extensionViewReduxForm(formConfig)(StandardEvent);
