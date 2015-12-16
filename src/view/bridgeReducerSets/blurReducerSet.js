import combineBridgeReducerSets from '../utils/combineBridgeReducerSets';
import elementFilterReducerSet from './common/elementFilterReducerSet';
import bubblingReducerSet from './common/bubblingReducerSet';

export default combineBridgeReducerSets(
  elementFilterReducerSet,
  bubblingReducerSet
);
