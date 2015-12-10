import React from 'react';
import Coral from 'coralui-support-react';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import {
  setShowSpecificElementsFilter,
  setShowElementPropertiesFilter
} from '../actions/elementFilterActions';
import { connect } from 'react-redux';

let mapStateToProps = state => ({
  showSpecificElementsFilter: state.get('showSpecificElementsFilter'),
  showElementPropertiesFilter: state.get('showElementPropertiesFilter')
});

class ElementFilter extends React.Component {
  onSpecificityChange = event => {
    this.props.dispatch(setShowSpecificElementsFilter(event.target.value === 'true'));
  };

  onShowElementPropertiesChange = event => {
    this.props.dispatch(setShowElementPropertiesFilter(event.target.checked));
  };

  render() {
    return (
      <div>
        <span className="u-gapRight">On</span>
        <Coral.Radio
            name="filter"
            value="true"
            checked={this.props.showSpecificElementsFilter}
            coral-onChange={this.onSpecificityChange}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!this.props.showSpecificElementsFilter}
            coral-onChange={this.onSpecificityChange}>
          any element
        </Coral.Radio>
        {
          this.props.showSpecificElementsFilter ?
            <div>
              <ElementSelectorField/>
              <div>
                <Coral.Checkbox
                  checked={this.props.showElementPropertiesFilter}
                  coral-onChange={this.onShowElementPropertiesChange}>and having certain property values...</Coral.Checkbox>
                { this.props.showElementPropertiesFilter ? <ElementPropertiesEditor/> : null }
              </div>
            </div> : null
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ElementFilter);
