import React from 'react';
import Coral from 'coralui-support-react';
import { connect } from 'react-redux';
import { actionCreators } from './actions/cartAmountActions';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import ComparisonOperatorField from './components/comparisonOperatorField';

export let mapStateToProps = state => ({
  dataElementName: state.get('dataElementName'),
  operator: state.get('operator'),
  amount: state.get('amount'),
  dataElementNameIsEmpty: state.getIn(['errors', 'dataElementNameIsEmpty']),
  amountIsEmpty: state.getIn(['errors', 'amountIsEmpty']),
  amountIsNaN: state.getIn(['errors', 'amountIsNaN'])
});

export class CartAmount extends React.Component {
  onDataElementChange = dataElementName => {
    this.props.dispatch(actionCreators.setDataElementName(dataElementName));
  };

  onOperatorChange = operator => {
    this.props.dispatch(actionCreators.setOperator(operator));
  };

  onAmountChange = event => {
    this.props.dispatch(actionCreators.setAmount(event.target.value));
  };

  render() {
    let dataElementNameError;
    let amountError;

    if (this.props.dataElementNameIsEmpty) {
      dataElementNameError = 'Please specify a data element.';
    }

    if (this.props.amountIsEmpty) {
      amountError = 'Please specify a cart amount';
    } else if (this.props.amountIsNaN) {
      amountError = 'Please specify a number for the cart amount';
    }

    return (
      <div>
        <div>
          <ValidationWrapper error={dataElementNameError}>
            <label>
              <span className="u-label">The cart amount identified by the data element</span>
              <DataElementNameField
                value={this.props.dataElementName}
                onChange={this.onDataElementChange}/>
            </label>
          </ValidationWrapper>
        </div>
        <div className="u-gapTop">
          <label className="u-gapRight">
            <span className="u-label">is</span>
            <ComparisonOperatorField
              value={this.props.operator}
              onChange={this.onOperatorChange}/>
          </label>
          <ValidationWrapper error={amountError}>
            <label>
              <span className="u-label">the value</span>
              <Coral.Textfield
                value={this.props.amount}
                onChange={this.onAmountChange}/>
            </label>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CartAmount);
