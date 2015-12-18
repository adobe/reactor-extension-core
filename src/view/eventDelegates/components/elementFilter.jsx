import React from 'react';
import Coral from 'coralui-support-react';
import ElementSelectorField from './elementSelectorField';
import ElementPropertiesEditor from './elementPropertiesEditor';
import { actionCreators } from '../actions/common/elementFilterActions';
import { connect } from 'react-redux';

export let mapStateToProps = state => ({
  showSpecificElementsFilter: state.get('showSpecificElementsFilter'),
  showElementPropertiesFilter: state.get('showElementPropertiesFilter')
});

export class ElementFilter extends React.Component {
  setShowSpecificElementsFilter = event => {
    let action = actionCreators.setShowSpecificElementsFilter(event.target.value === 'true');
    this.props.dispatch(action);
  };

  setShowElementPropertiesFilter = event => {
    let action = actionCreators.setShowElementPropertiesFilter(event.target.checked);
    this.props.dispatch(action);
  };

  render() {
    return (
      <div>
        <span className="u-label">On</span>
        <Coral.Radio
            name="filter"
            value="true"
            checked={this.props.showSpecificElementsFilter}
            onChange={this.setShowSpecificElementsFilter}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!this.props.showSpecificElementsFilter}
            onChange={this.setShowSpecificElementsFilter}>
          any element
        </Coral.Radio>
        {
          this.props.showSpecificElementsFilter ?
            <div ref="specificElementFields">
              <ElementSelectorField/>
              <div>
                <Coral.Checkbox
                  checked={this.props.showElementPropertiesFilter}
                  onChange={this.setShowElementPropertiesFilter}>and having certain property values...</Coral.Checkbox>
                { this.props.showElementPropertiesFilter ? <ElementPropertiesEditor ref="elementPropertiesEditor"/> : null }
              </div>
            </div> : null
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ElementFilter);
