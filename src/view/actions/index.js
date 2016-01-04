import reducerReducers from 'reduce-reducers';

// Common
import bridgeAdapterActions from './bridgeAdapterActions';
import bubbleActions from '../eventDelegates/actions/common/bubbleActions';
import elementFilterActions from '../eventDelegates/actions/common/elementFilterActions';

// Events
import clickEventActions from '../eventDelegates/actions/clickActions';

// Conditions
import browserConditionActions from '../conditionDelegates/actions/browserActions';
import cookieConditionActions from '../conditionDelegates/actions/cookieActions';
import cookieOptOutConditionActions from '../conditionDelegates/actions/cookieOptOutActions';

// Data Elements
import cookieDataElementActions from '../dataElementDelegates/actions/cookieActions';
import customDataElementActions from '../dataElementDelegates/actions/customActions';
import domDataElementActions from '../dataElementDelegates/actions/domActions';
import queryParamDataElementActions from '../dataElementDelegates/actions/queryParamActions';
import variableDataElementActions from '../dataElementDelegates/actions/variableActions';

export default reducerReducers(
  bridgeAdapterActions,
  bubbleActions,
  elementFilterActions,
  clickEventActions,
  browserConditionActions,
  cookieConditionActions,
  cookieOptOutConditionActions,
  cookieDataElementActions,
  customDataElementActions,
  domDataElementActions,
  queryParamDataElementActions,
  variableDataElementActions
);
