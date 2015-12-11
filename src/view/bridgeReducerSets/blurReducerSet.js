import combineBridgeReducerSets from '../utils/combineBridgeReducerSets';
import elementFilterReducerSet from './chunks/elementFilterReducerSet';
import bubblingReducerSet from './chunks/bubblingReducerSet';

export default combineBridgeReducerSets(
  elementFilterReducerSet,
  bubblingReducerSet
);
