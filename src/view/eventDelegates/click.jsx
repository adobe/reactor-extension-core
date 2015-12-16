import React from 'react';
import Coral from 'coralui-support-react';
import AdvancedEventOptions from './components/advancedEventOptions';
import ElementFilter from './components/elementFilter';
import { connect } from 'react-redux';
import { actionCreators } from './actions/clickActions';

export let mapStateToProps = state => ({
  delayLinkActivation: state.get('delayLinkActivation')
});

export class Click extends React.Component {
  onDelayLinkActivationChange = event => {
    this.props.dispatch(actionCreators.setDelayLinkActivation(event.target.checked));
  };

  render() {
    return (
      <div>
        <ElementFilter/>
        <Coral.Checkbox
          class="u-block"
          onChange={this.onDelayLinkActivationChange}
          checked={this.props.delayLinkActivation}>If the element is a link, delay navigation until rule runs</Coral.Checkbox>
        <AdvancedEventOptions/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Click);
