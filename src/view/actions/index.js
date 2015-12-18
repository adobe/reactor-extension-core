import reducerReducers from 'reduce-reducers';

// Common
import bridgeAdapterActions from './bridgeAdapterActions';
import bubbleActions from '../eventDelegates/actions/common/bubbleActions';
import elementFilterActions from '../eventDelegates/actions/common/elementFilterActions';

// Events
import clickEventActions from '../eventDelegates/actions/clickActions';

// Data Elements
import cookieDataElementActions from '../dataElementDelegates/actions/cookieActions';
import customDataElementActions from '../dataElementDelegates/actions/customActions';
import domDataElementActions from '../dataElementDelegates/actions/domActions';

export default reducerReducers(
  bridgeAdapterActions,
  bubbleActions,
  elementFilterActions,
  clickEventActions,
  cookieDataElementActions,
  customDataElementActions,
  domDataElementActions
);
