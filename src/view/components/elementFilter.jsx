import React from 'react';
import Coral from 'coralui-support-react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import {stateStream} from '../store';
import {setShowElementFilterFields} from '../actions';

export default React.createClass({
  getInitialState: function() {
    return {
      showElementFilterFields: false
    }
  },

  componentDidMount: function() {
    this.unsub = stateStream
      .filterByChanges('showElementFilterFields')
      .map((state) => {
        return {
          showElementFilterFields: state.get('showElementFilterFields')
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsub();
  },

  onSpecificityChange: function(event) {
    setShowElementFilterFields.push(event.target.value === 'true');
  },

  render: function() {
    var filterOptions;

    if (this.state.showElementFilterFields) {
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
            checked={this.state.showElementFilterFields ? true : null}
            coral-onChange={this.onSpecificityChange}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!this.state.showElementFilterFields ? true : null}
            coral-onChange={this.onSpecificityChange}>
          any element
        </Coral.Radio>
        {filterOptions}
      </div>
    );
  }
})
