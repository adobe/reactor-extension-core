import reducerReducers from 'reduce-reducers';

// Common
import bridgeAdapterActions from './common/bridgeAdapterActions';
import bubbleActions from './common/bubbleActions';
import elementFilterActions from './common/elementFilterActions';

// View-specific
import clickActions from './clickActions';
import cookieActions from './cookieActions';

export default reducerReducers(
  bridgeAdapterActions,
  bubbleActions,
  elementFilterActions,
  clickActions,
  cookieActions
);
