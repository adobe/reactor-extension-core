import React from 'react';
import Coral from 'coralui-support-react';
import { stateStream } from '../store';
import actions from '../actions/elementSelectorActions';
import ValidationWrapper from './validationWrapper';

export default React.createClass({
  getInitialState: function() {
    return {
      elementSelector: ''
    }
  },

  componentDidMount: function() {
    this.unsubscribe = stateStream
      .map(state => {
        return {
          elementSelector: state.get('elementSelector'),
          selectorInvalid: state.getIn(['errors', 'selectorInvalid'])
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  handleChange: function(event) {
    actions.elementSelector.push(event.target.value);
  },

  render: function() {
    let error;

    if (this.state.selectorInvalid) {
      error = 'Please specify a selector. Alternatively, choose to target any element above.';
    }

    return (
      <label>
        <span className="u-gapRight">matching the CSS selector</span>
        <ValidationWrapper error={error}>
          <Coral.Textfield
            placeholder="CSS Selector"
            value={this.state.elementSelector}
            onChange={this.handleChange}/>
        </ValidationWrapper>
      </label>
    );
  }
});
