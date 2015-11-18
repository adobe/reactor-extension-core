import React from 'react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from '../components/advancedEventOptions';

export default React.createClass({
  render: function() {
    return (
      <div>
        <span className="eventNameLabel u-gapRight">Click:</span>
        <ElementSelectorField/>
        <ElementPropertiesEditor/>
        <Coral.Checkbox name="delayLinkActivation" class="u-block">If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
});
