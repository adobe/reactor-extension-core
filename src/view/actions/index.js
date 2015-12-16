import reducerReducers from 'reduce-reducers';

// Common
import bridgeAdapterActions from './bridgeAdapterActions';
import bubbleActions from '../eventDelegates/actions/common/bubbleActions';
import elementFilterActions from '../eventDelegates/actions/common/elementFilterActions';

// View-specific
import clickActions from '../eventDelegates/actions/clickActions';
import cookieActions from '../dataElementDelegates/actions/cookieActions';

export default reducerReducers(
  bridgeAdapterActions,
  bubbleActions,
  elementFilterActions,
  clickActions,
  cookieActions
);
