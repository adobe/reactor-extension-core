import React from 'react';
import Coral from 'coralui-support-react';
import {stateStream} from '../store';
import {setConfigParts} from '../actions';

export default React.createClass({
  getInitialState: function() {
    return {
      elementSelector: ''
    }
  },

  componentDidMount: function() {
    this.unsub = stateStream
      .filterByChanges('config.elementSelector')
      .map((state) => {
        return {
          elementSelector: state.get('config').get('elementSelector')
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsub();
  },


  handleChange: function(event) {
    setConfigParts.push({
      'elementSelector': event.target.value
    });
  },

  render: function() {
    return (
      <label>
        <span className="u-italic u-gapRight">matching the CSS selector</span>
        <Coral.Textfield
          placeholder="CSS Selector"
          className="u-gapRight"
          value={this.state.elementSelector}
          onChange={this.handleChange}/>
      </label>
    );
  }
});
