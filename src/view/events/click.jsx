import React from 'react';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementFilter from '../components/elementFilter';
import { connect } from 'react-redux';
import { setDelayLinkActivation } from '../actions/delayLinkActivationActions';

@connect(state => ({ delayLinkActivation: state.get('delayLinkActivation') }))
export default class Click extends React.Component {
  onDelayLinkActivationChange = event => {
    this.props.dispatch(setDelayLinkActivation(event.target.checked));
  };

  render() {
    return (
      <div>
        <span className="eventNameLabel u-gapRight">Click:</span>
        <ElementFilter/>
        <Coral.Checkbox
          class="u-block"
          coral-onChange={this.onDelayLinkActivationChange}
          checked={this.props.delayLinkActivation}>If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
}
