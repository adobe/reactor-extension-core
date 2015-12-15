import React from 'react';
import Coral from 'coralui-support-react';
import { actionCreators } from '../actions/elementFilterActions';
import ValidationWrapper from './validationWrapper';
import { connect } from 'react-redux';

export let mapStateToProps = state => ({
  elementSelector: state.get('elementSelector'),
  selectorInvalid: state.getIn(['errors', 'selectorInvalid'])
});

export class ElementSelectorField extends React.Component {
  handleChange = event => {
    this.props.dispatch(actionCreators.setElementSelector(event.target.value));
  };

  render() {
    let error;

    if (this.props.selectorInvalid) {
      error = 'Please specify a selector. Alternatively, choose to target any element above.';
    }

    return (
      <label>
        <span className="u-gapRight">matching the CSS selector</span>
        <ValidationWrapper error={error}>
          <Coral.Textfield
            placeholder="CSS Selector"
            value={this.props.elementSelector}
            onChange={this.handleChange}/>
        </ValidationWrapper>
      </label>
    );
  }
}

export default connect(mapStateToProps)(ElementSelectorField);
