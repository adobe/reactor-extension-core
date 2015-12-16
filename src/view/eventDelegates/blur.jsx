import React from 'react';
import AdvancedEventOptions from './components/advancedEventOptions';
import ElementFilter from './components/elementFilter';
import { connect } from 'react-redux';

let mapStateToProps = state => ({
  delayLinkActivation: state.get('delayLinkActivation')
});

class Blur extends React.Component {
  render() {
    return (
      <div>
        <ElementFilter/>
        <AdvancedEventOptions/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Blur);
