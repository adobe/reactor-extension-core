import React from 'react';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from '../components/advancedEventOptions';
import store from '../store';
import ElementFilter from '../components/elementFilter';
import actions from '../actions/clickActions';
import Immutable from 'immutable';

export default React.createClass({
  getInitialState: function() {
    return {
      delayLinkActivation: false
    }
  },

  componentDidMount: function() {
    this.disposable = store
      .map(state => {
        return {
          delayLinkActivation: state.get('delayLinkActivation')
        };
      })
      .subscribe(state => this.setState(state));
  },

  componentWillUnmount: function() {
    this.disposable.dispose();
  },

  onDelayLinkActivationChange: function(event) {
    actions.delayLinkActivation.onNext(event.target.checked);
  },

  render: function() {
    return (
      <div>
        <span className="eventNameLabel u-gapRight">Click:</span>
        <ElementFilter/>
        <Coral.Checkbox
          class="u-block"
          coral-onChange={this.onDelayLinkActivationChange}
          checked={this.state.delayLinkActivation ? true : null}>If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
});
