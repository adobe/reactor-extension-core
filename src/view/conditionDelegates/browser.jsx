import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/browserActions'

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
  onChange = event => {
    let browser = event.target.value;
    let selectedBrowsers = this.props.browsers;
    let index = selectedBrowsers.indexOf(browser);

    if (event.target.checked) {
      if (index === -1) {
        selectedBrowsers = selectedBrowsers.push(browser);
      }
    } else {
      if (index !== -1) {
        selectedBrowsers = selectedBrowsers.delete(index);
      }
    }

    this.props.dispatch(actionCreators.setBrowsers(selectedBrowsers));
  };

  render() {
    let browserOptions = BROWSERS.map(browser => {
      return (
        <li key={browser}>
          <Coral.Checkbox
            value={browser}
            checked={this.props.browsers.indexOf(browser) !== -1}
            onChange={this.onChange}>
            {browser}
          </Coral.Checkbox>
        </li>
      );
    });

    return (
      <ul className="BrowserCondition-browserOptionList">
        {browserOptions}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(Browser);
