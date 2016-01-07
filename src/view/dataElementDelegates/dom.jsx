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
    // It would porbably make sense to not return here but just create an empty Select with no
    // options if this.props.elementPropertyPresets isn't defined.
    // In the case of the DOM condition view, this doesn't function properly because of how React
    // and CoralUI interact. If this.props.elementPropertyPresets were empty, the Select component
    // would first render with no options. Once legit info comes from the parent window, the bridge
    // reducer is run and the state would be populated with real options to be displayed in the
    // Select component. Unfortunately, using the "value" property on Coral.Select to set the selected
    // option won't work on the second React render because the options aren't added as children
    // until after the property is set. CoralUI will ignore the attempt to set the "value" property
    // because it will see the value as invalid. We could set the "selected" property on the option
    // that should be selected, but React tries to set the property on the option before it is added
    // to the parent. CoralUI has a restriction that doesn't allow a consumer to set an option as
    // selected before it has been added to the parent. This is logged here:
    // https://jira.corp.adobe.com/browse/CUI-3389
    if (!this.props.elementPropertyPresets) {
      return <div></div>;
    }

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
                this.props.elementPropertyPresets.map(preset => {
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
