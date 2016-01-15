import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from '../../components/regexToggle';

export default class ElementPropertyEditor extends React.Component {
  remove = () => {
    this.props.remove();
  };

  render() {
    const { name, value, valueIsRegex, removable } = this.props;

    var removeButton;

    if (removable) {
      removeButton = (
        <Coral.Button
          ref="removeButton"
          variant="quiet"
          icon="close"
          iconsize="XS"
          onClick={this.remove}/>
      );
    }

    return (
      <div className="u-gapBottom">
        <Coral.Textfield 
          className="u-gapRight"
          placeholder="Property"
          {...name}/>
        <span className="u-label">=</span>
        <Coral.Textfield 
          className="u-gapRight"
          placeholder="Value"
          {...value}/>
        <RegexToggle
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          onValueChange={value.onChange}
          onValueIsRegexChange={valueIsRegex.onChange}/>
        {removeButton}
      </div>
    )
  }
}
