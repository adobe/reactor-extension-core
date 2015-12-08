import React from 'react';
import Coral from 'coralui-support-react';
import store from '../store';
import actions from '../actions/elementSelectorActions';
import ValidationWrapper from './validationWrapper';

export default React.createClass({
  getInitialState: function() {
    return {
      elementSelector: ''
    }
  },

  componentDidMount: function() {
    this.disposable = store
      .map(state => {
        return {
          elementSelector: state.get('elementSelector'),
          selectorInvalid: state.getIn(['errors', 'selectorInvalid'])
        };
      })
      .subscribe(state => this.setState(state));
  },

  componentWillUnmount: function() {
    this.disposable.dispose();
  },

  handleChange: function(event) {
    actions.elementSelector.onNext(event.target.value);
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
