import React from 'react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from '../components/advancedEventOptions';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  getInitialState: function() {
    return {
      config: store.getConfig()
    };
  },

  onDelayLinkActivationChange: function(event) {
    this.state.config.delayLinkActivation = event.target.checked || null;
  },

  render: function() {
    return (
      <div>
        <span className="eventNameLabel u-gapRight">Click:</span>
        <ElementSelectorField/>
        <ElementPropertiesEditor/>
        <Coral.Checkbox
          class="u-block"
          coral-onChange={this.onDelayLinkActivationChange}
          checked={this.state.config.delayLinkActivation}>If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
});
