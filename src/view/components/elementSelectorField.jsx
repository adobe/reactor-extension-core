import React from 'react';
import Coral from 'coralui-support-react';
import {stateStream} from '../store';
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
          elementSelector: state.get('config').get('elementSelector'),
          elementFilterShownWithoutInput:
            state.getIn(['validationErrors', 'elementFilterShownWithoutInput'])
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  handleChange: function(event) {
    actions.setElementSelector.push(event.target.value);
  },

  render: function() {
    let error;

    if (this.state.elementFilterShownWithoutInput) {
      error = 'Please specify a selector or property value. ' +
        'Alternatively, choose to target any element.';
    }

    return (
      <label>
        <span className="u-italic u-gapRight">matching the CSS selector</span>
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
