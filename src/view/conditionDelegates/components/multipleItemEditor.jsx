import React from 'react';
import Coral from 'coralui-support-react';

export default class MultipleItemEditor extends React.Component {
  render() {
    const { items, renderItem, getKey, onAddItem, onRemoveItem  } = this.props;

    const rows = items.map((item, i) => {
      return (
        <div ref={'row' + i} key={getKey(item)}>
          { i !== 0 ? <div className="MultipleItemEditor-orLabel">or</div> : null }
          { renderItem(item, i) }
          {
            items.length > 1 ?
              <Coral.Button
                ref={'removeButton' + i}
                className="u-gapLeft"
                icon="close"
                iconsize="S"
                variant="quiet"
                onClick={onRemoveItem.bind(this, i)}>
                Remove Pattern
              </Coral.Button> : null
          }
        </div>
      );
    });

    return (
      <div>
        {rows}
        <div>
          <Coral.Button
            ref="addButton"
            className="MultipleItemEditor-addPatternButton"
            icon="addCircle"
            iconsize="S"
            variant="quiet"
            onClick={onAddItem}>
            Add Pattern
          </Coral.Button>
        </div>
      </div>
    );
  }
}
