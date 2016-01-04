import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/browserActions';
import CheckboxList from '../components/checkboxList';

export let mapStateToProps = state => ({
  browsers: state.get('browsers')
});

const BROWSERS = [
  'Chrome',
  'Firefox',
  'IE',
  'Safari',
  'Opera',
  'Mobile Safari',
  'IE Mobile',
  'Opera Mini',
  'Opera Mobile',
  'OmniWeb'
];

export class Browser extends React.Component {
  select = browser => {
    let browsers = this.props.browsers.push(browser);
    this.props.dispatch(actionCreators.setBrowsers(browsers));
  };

  deselect = browser => {
    let index = this.props.browsers.indexOf(browser);
    let browsers = this.props.browsers.delete(index);
    this.props.dispatch(actionCreators.setBrowsers(browsers));
  };

  render() {
    return <CheckboxList
      items={BROWSERS}
      selectedValues={this.props.browsers}
      select={this.select}
      deselect={this.deselect}/>
  }
}

export default connect(mapStateToProps)(Browser);
