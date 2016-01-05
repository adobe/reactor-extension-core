import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/directCallActions';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  name: state.get('name'),
  nameInvalid: state.getIn(['errors', 'nameInvalid'])
});

export class DirectCall extends React.Component {
  onNameChange = event => {
    this.props.dispatch(actionCreators.setName(event.target.value));
  };

  render() {
    let error;

    if (this.props.nameInvalid) {
      error = 'Please specify a rule name.';
    }

    return (
      <ValidationWrapper error={error}>
        <label>
          <span className="u-label">String:</span>
          <Coral.Textfield
            value={this.props.name}
            onChange={this.onNameChange}/>
        </label>
      </ValidationWrapper>
    );
  }
}

export default connect(mapStateToProps)(DirectCall);
