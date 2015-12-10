import combineBridgeReducerSets from '../utils/combineBridgeReducerSets';
import elementFilterReducerSet from './chunks/elementFilterReducerSet';
import delayLinkActivationReducerSet from './chunks/delayLinkActivationReducerSet';
import bubblingReducerSet from './chunks/bubblingReducerSet';

export default combineBridgeReducerSets(
  elementFilterReducerSet,
  delayLinkActivationReducerSet,
  bubblingReducerSet
);
