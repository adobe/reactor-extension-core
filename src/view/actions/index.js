import reducerReducers from 'reduce-reducers';
import bridgeAdapterActions from './bridgeAdapterActions';
import bubbleActions from './bubbleActions';
import delayLinkActivationActions from './delayLinkActivationActions';
import elementFilterActions from './elementFilterActions';

export default reducerReducers(
  bridgeAdapterActions,
  bubbleActions,
  delayLinkActivationActions,
  elementFilterActions
);
