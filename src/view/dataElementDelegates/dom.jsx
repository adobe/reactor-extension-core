import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/domActions';
import ValidationWrapper from '../components/validationWrapper';

export let mapStateToProps = state => ({
  elementSelector: state.get('elementSelector'),
  elementSelectorInvalid: state.getIn(['errors', 'elementSelectorInvalid']),
  elementProperty: state.get('elementProperty'),
  elementPropertyInvalid: state.getIn(['errors', 'elementPropertyInvalid'])
});

export class DOM extends React.Component {
  optionsMap = {
    id: 'id',
    href: 'href',
    class: 'class',
    src: 'src',
    alt: 'alt',
    innerHTML: 'HTML',
    text: 'text',
    name: 'name',
    value: 'value',
    type: 'type',
    other: 'other attribute'
  };

  componentWillMount() {
    if (this.props.elementProperty === undefined) {
      this.props.dispatch(actionCreators.setElementProperty('id'));
    }
  }

  onElementSelectorChange = event => {
    this.props.dispatch(actionCreators.setElementSelector(event.target.value));
  };

  onElementPropertyChange = event => {
    let selectedValue = event.target.value;
    let elementProperty = selectedValue === 'other' ? '' : selectedValue;
    this.props.dispatch(actionCreators.setElementProperty(elementProperty));
  };

  onOtherElementPropertyChange = event => {
    this.props.dispatch(actionCreators.setElementProperty(event.target.value));
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

    let values = Object.keys(this.optionsMap);
    let selectedValueIndex = values.indexOf(this.props.elementProperty);
    let selectedValue = selectedValueIndex !== -1 ? values[selectedValueIndex] : 'other';

    return (
      <div>
        <div className="u-gapBottom">
          <ValidationWrapper error={elementSelectorError}>
            <label>
              <span className="u-label">From the DOM element matching the CSS Selector</span>
              <Coral.Textfield value={this.props.elementSelector} onChange={this.onElementSelectorChange}/>
            </label>
          </ValidationWrapper>
        </div>
        <div>
          <label>
            <span className="u-label">Return the value of</span>
            <Coral.Select value={selectedValue} onChange={this.onElementPropertyChange} className="u-gapRight">
              {
                Object.keys(this.optionsMap).map(value => {
                  return <Coral.Select.Item key={value} value={value}>{this.optionsMap[value]}</Coral.Select.Item>;
                })
              }
            </Coral.Select>
          </label>
          {
            (selectedValue === 'other') ?
            <ValidationWrapper error={elementPropertyError}>
              <Coral.Textfield value={this.props.elementProperty} onChange={this.onOtherElementPropertyChange}/>
            </ValidationWrapper>
            : null
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(DOM);
