import React from 'react';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from '../components/advancedEventOptions';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';
import ElementFilter from '../components/elementFilter';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  onDelayLinkActivationChange: function(event) {
    this.config.delayLinkActivation = event.target.checked || null;
  },

  render: function() {
    return (
      <div>
        <span className="eventNameLabel u-gapRight">Click:</span>
        <ElementFilter/>
        <Coral.Checkbox
          class="u-block"
          coral-onChange={this.onDelayLinkActivationChange}
          checked={this.config.delayLinkActivation}>If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
});
