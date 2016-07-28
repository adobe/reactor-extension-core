import React from 'react';
import Button from '@coralui/react-coral/lib/Button';

export default function MultipleItemEditor({ ...props }) {
  const { items, renderItem, getKey, onAddItem, onRemoveItem } = props;

  const rows = items.map((item, i) => (
    <div data-type="row" key={ getKey(item) }>
      { i !== 0 ? <div className="MultipleItemEditor-orLabel">or</div> : null }
      { renderItem(item, i) }
      {
        items.length > 1 ?
          <Button
            className="u-gapLeft"
            icon="close"
            iconSize="S"
            variant="quiet"
            onClick={ onRemoveItem.bind(this, i) }
          >
            Remove Pattern
          </Button> : null
      }
    </div>
  ));

  return (
    <div>
      { rows }
      <div>
        <Button
          className="MultipleItemEditor-addPatternButton"
          icon="addCircle"
          iconSize="S"
          variant="quiet"
          onClick={ onAddItem }
        >
          Add Pattern
        </Button>
      </div>
    </div>
  );
}
