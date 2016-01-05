import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/domainActions';
import CheckboxList from '../components/checkboxList';
import { List } from 'immutable';

export let mapStateToProps = state => ({
  availableDomains: state.get('availableDomains'),
  selectedDomains: state.get('selectedDomains')
});

export class Domain extends React.Component {
  select = domain => this.props.dispatch(actionCreators.selectDomain(domain));

  deselect = domain => this.props.dispatch(actionCreators.deselectDomain(domain));

  render() {
    return <CheckboxList
      items={this.props.availableDomains}
      selectedValues={this.props.selectedDomains}
      select={this.select}
      deselect={this.deselect}/>
  }
}

export default connect(mapStateToProps)(Domain);
