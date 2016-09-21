import React from 'react';

import extensionViewReduxForm from '../extensionViewReduxForm';
import DelayType, { formConfig as delayTypeFormConfig } from './components/delayType';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import SpecificElements, { formConfig as specificElementsFormConfig } from './components/specificElements';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const Hover = ({ ...props }) => (
  <div>
    <SpecificElements fields={ props.fields } />
    <DelayType fields={ props.fields } />
    <AdvancedEventOptions fields={ props.fields } />
  </div>
);

const formConfig = mergeFormConfigs(
  delayTypeFormConfig,
  specificElementsFormConfig,
  advancedEventOptionsFormConfig
);

export default extensionViewReduxForm(formConfig)(Hover);
