import React from 'react';
import Coral from 'coralui-support-react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import { stateStream } from '../store';
import actions from '../actions/elementFilterActions';

export default React.createClass({
  getInitialState: function() {
    return {
      showElementFilterFields: false
    }
  },

  componentDidMount: function() {
    this.unsubscribe = stateStream
      .map(state => {
        return {
          showSpecificElementsFilter: state.get('showSpecificElementsFilter'),
          showElementPropertiesFilter: state.get('showElementPropertiesFilter')
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onSpecificityChange: function(event) {
    actions.showSpecificElementsFilter.push(event.target.value === 'true');
  },

  setShowElementPropertiesFilter: function(event) {
    actions.showElementPropertiesFilter.push(event.target.checked);
  },

  render: function() {
    return (
      <div>
        <span className="u-gapRight">On</span>
        <Coral.Radio
            name="filter"
            value="true"
            checked={this.state.showSpecificElementsFilter ? true : null}
            coral-onChange={this.onSpecificityChange}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!this.state.showSpecificElementsFilter ? true : null}
            coral-onChange={this.onSpecificityChange}>
          any element
        </Coral.Radio>
        {
          this.state.showSpecificElementsFilter ?
            <div>
              <ElementSelectorField/>
              <div>
                <Coral.Checkbox
                  checked={this.state.showElementPropertiesFilter ? true : null}
                  coral-onChange={this.setShowElementPropertiesFilter}>and having certain property values...</Coral.Checkbox>
                { this.state.showElementPropertiesFilter ? <ElementPropertiesEditor/> : null }
              </div>
            </div> : null
        }
      </div>
    );
  }
})
