import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/cookieOptOutActions'

export let mapStateToProps = state => ({
  acceptsCookies: state.get('acceptsCookies')
});

export class CookieOptOut extends React.Component {
  onChange = event => {
    this.props.dispatch(actionCreators.setAcceptsCookies(event.target.checked));
  };

  render() {
    return <Coral.Checkbox checked={this.props.acceptsCookies} onChange={this.onChange}>User accepts cookies (EU)</Coral.Checkbox>
  }
}

export default connect(mapStateToProps)(CookieOptOut);
