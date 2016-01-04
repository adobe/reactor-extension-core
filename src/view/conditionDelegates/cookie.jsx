import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/cookieActions'
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  name: state.get('name'),
  nameInvalid: state.getIn(['errors', 'nameInvalid']),
  value: state.get('value'),
  valueInvalid: state.getIn(['errors', 'valueInvalid']),
  valueIsRegex: state.get('valueIsRegex')
});

export class Cookie extends React.Component {
  onNameChange = event => {
    this.setName(event.target.value);
  };

  setName = name => {
    this.props.dispatch(actionCreators.setName(name));
  };

  onValueChange = event => {
    this.setValue(event.target.value);
  };

  setValue = value => {
    this.props.dispatch(actionCreators.setValue(value));
  };

  setValueIsRegex = valueIsRegex => {
    this.props.dispatch(actionCreators.setValueIsRegex(valueIsRegex));
  };

  render() {
    let nameError;
    let valueError;

    if (this.props.nameInvalid) {
      nameError = 'Please specify a cookie name.';
    }

    if (this.props.valueInvalid) {
      valueError = 'Please specify a cookie value.';
    }

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={nameError}>
          <label>
            <span className="u-label">Cookie Name:</span>
            <Coral.Textfield
              value={this.props.name}
              onChange={this.onNameChange}/>
          </label>
        </ValidationWrapper>
        <ValidationWrapper className="u-gapRight" error={valueError}>
          <label>
            <span className="u-label">Cookie Value:</span>
            <Coral.Textfield
              value={this.props.value}
              onChange={this.onValueChange}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={this.props.value}
          valueIsRegex={this.props.valueIsRegex}
          setValue={this.setValue}
          setValueIsRegex={this.setValueIsRegex}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Cookie);
