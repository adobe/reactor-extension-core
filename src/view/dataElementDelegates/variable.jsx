import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/variableActions';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  path: state.get('path'),
  pathInvalid: state.getIn(['errors', 'pathInvalid'])
});

export class Variable extends React.Component {
  onPathChange = event => {
    this.props.dispatch(actionCreators.setPath(event.target.value));
  };

  render() {
    let error;

    if (this.props.pathInvalid) {
      error = 'Please specify a variable path.';
    }

    return (
      <ValidationWrapper error={error}>
        <label>
          <span className="u-label">Path to variable:</span>
          <Coral.Textfield
            value={this.props.path}
            onChange={this.onPathChange}/>
        </label>
      </ValidationWrapper>
    );
  }
}

export default connect(mapStateToProps)(Variable);
