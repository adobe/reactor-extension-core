import React from 'react';
import Coral from 'coralui-support-react';
import { actionCreators } from '../actions/common/elementFilterActions';
import ValidationWrapper from '../../components/validationWrapper';
import { connect } from 'react-redux';

export let mapStateToProps = state => ({
  elementSelector: state.get('elementSelector'),
  selectorIsEmpty: state.getIn(['errors', 'selectorIsEmpty'])
});

export class ElementSelectorField extends React.Component {
  handleChange = event => {
    this.props.dispatch(actionCreators.setElementSelector(event.target.value));
  };

  render() {
    let error;

    if (this.props.selectorIsEmpty) {
      error = 'Please specify a selector. Alternatively, choose to target any element above.';
    }

    return (
      <ValidationWrapper error={error}>
        <label>
          <span className="u-label">matching the CSS selector</span>
          <Coral.Textfield
            value={this.props.elementSelector}
            onChange={this.handleChange}/>
        </label>
      </ValidationWrapper>
    );
  }
}

export default connect(mapStateToProps)(ElementSelectorField);
