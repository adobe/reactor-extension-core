import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/domActions';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  elementSelector: state.get('elementSelector'),
  selectedElementPropertyPreset: state.get('selectedElementPropertyPreset'),
  customElementProperty: state.get('customElementProperty'),
  elementPropertyPresets: state.get('elementPropertyPresets'),
  elementSelectorInvalid: state.getIn(['errors', 'elementSelectorInvalid']),
  elementPropertyInvalid: state.getIn(['errors', 'elementPropertyInvalid'])
});

export class DOM extends React.Component {
  onElementSelectorChange = event => {
    this.props.dispatch(actionCreators.setElementSelector(event.target.value));
  };

  onElementPropertyPresetChange = event => {
    this.props.dispatch(actionCreators.setSelectedElementPropertyPreset(event.target.value));
  };

  onCustomElementPropertyChange = event => {
    this.props.dispatch(actionCreators.setCustomElementProperty(event.target.value));
  };

  render() {
    let elementSelectorError;
    let elementPropertyError;

    if (this.props.elementSelectorInvalid) {
      elementSelectorError = 'Please specify a CSS selector.';
    }

    if (this.props.elementPropertyInvalid) {
      elementPropertyError = 'Please specify an element property';
    }

    return (
      <div>
        <div className="u-gapBottom">
          <ValidationWrapper error={elementSelectorError}>
            <label>
              <span className="u-label">From the DOM element matching the CSS Selector</span>
              <Coral.Textfield
                value={this.props.elementSelector}
                onChange={this.onElementSelectorChange}/>
            </label>
          </ValidationWrapper>
        </div>
        <div>
          <label>
            <span className="u-label">Use the value of</span>
            <Coral.Select
              value={this.props.selectedElementPropertyPreset}
              onChange={this.onElementPropertyPresetChange}
              className="u-gapRight">
              {
                this.props.elementPropertyPresets.valueSeq().map(preset => {
                  return (
                    <Coral.Select.Item key={preset.get('value')} value={preset.get('value')}>
                      {preset.get('label')}
                    </Coral.Select.Item>
                  );
                })
              }
            </Coral.Select>
          </label>
          {
            (this.props.selectedElementPropertyPreset === 'custom') ?
            <ValidationWrapper error={elementPropertyError}>
              <Coral.Textfield
                value={this.props.customElementProperty}
                onChange={this.onCustomElementPropertyChange}/>
            </ValidationWrapper>
            : null
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(DOM);
