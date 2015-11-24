import React from 'react';
import Coral from 'coralui-support-react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import ConfigComponentMixin from '../mixins/configComponentMixin';
import store from '../store';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  getInitialState: function() {
    return {
      showFilter: false
    }
  },

  onStoreUpdate: function() {
    this.setState({
      showFilter: this.config.selector || this.config.elementProperties
    });
  },

  onSpecificityChange: function(event) {
    this.setState({
      showFilter: event.target.value === 'true'
    });
  },

  render: function() {
    var filterOptions;

    if (this.state.showFilter) {
      filterOptions = (
        <div>
          <ElementSelectorField/>
          <ElementPropertiesEditor/>
        </div>
      );
    }

    return (
      <div>
        <span className="u-gapRight">On</span>
        <Coral.Radio
            name="filter"
            value="true"
            checked={this.state.showFilter ? true : null}
            coral-onChange={this.onSpecificityChange}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!this.state.showFilter ? true : null}
            coral-onChange={this.onSpecificityChange}>
          any element
        </Coral.Radio>
        {filterOptions}
      </div>
    );
  }
})
