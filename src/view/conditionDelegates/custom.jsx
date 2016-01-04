import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/customActions';

export let mapStateToProps = state => ({
  script: state.get('script')
});

export class Custom extends React.Component {
  onOpenEditor = () => {
    window.extensionBridge.openCodeEditor(this.props.script, script => {
      this.props.dispatch(actionCreators.setScript(script));
    });
  };

  render() {
    return (
      <Coral.Button icon="code" onClick={this.onOpenEditor}>Open Editor</Coral.Button>
    );
  }
}

export default connect(mapStateToProps)(Custom);
