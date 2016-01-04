import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/queryParamActions';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  name: state.get('name'),
  caseInsensitive: state.get('caseInsensitive'),
  nameInvalid: state.getIn(['errors', 'nameInvalid'])
});

export class QueryParam extends React.Component {
  onNameChange = event => {
    this.props.dispatch(actionCreators.setName(event.target.value));
  };

  onCaseInsensitiveChange = event => {
    this.props.dispatch(actionCreators.setCaseInsensitive(event.target.checked));
  };

  render() {
    let error;

    if (this.props.nameInvalid) {
      error = 'Please specify a query string parameter name.';
    }

    return (
      <div>
        <ValidationWrapper error={error} className="u-gapRight">
          <label>
            <span className="u-label">URL Querystring Parameter Name:</span>
            <Coral.Textfield
              value={this.props.name}
              onChange={this.onNameChange}/>
          </label>
        </ValidationWrapper>
        <Coral.Checkbox
          checked={this.props.caseInsensitive}
          onChange={this.onCaseInsensitiveChange}>
          Ignore capitalization differences
        </Coral.Checkbox>
      </div>
    );
  }
}

export default connect(mapStateToProps)(QueryParam);
