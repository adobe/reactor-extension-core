import reducerReducers from 'reduce-reducers';

// Common
import bridgeAdapterActions from './bridgeAdapterActions';
import bubbleActions from '../eventDelegates/actions/common/bubbleActions';
import elementFilterActions from '../eventDelegates/actions/common/elementFilterActions';

// Events
import clickEventActions from '../eventDelegates/actions/clickActions';
import directCallEventActions from '../eventDelegates/actions/directCallActions';

// Conditions
import browserConditionActions from '../conditionDelegates/actions/browserActions';
import cartAmountConditionActions from '../conditionDelegates/actions/cartAmountActions';
import cookieConditionActions from '../conditionDelegates/actions/cookieActions';
import cookieOptOutConditionActions from '../conditionDelegates/actions/cookieOptOutActions';
import customConditionActions from '../conditionDelegates/actions/customActions';
import deviceTypeConditionActions from '../conditionDelegates/actions/deviceTypeActions';
import domainConditionActions from '../conditionDelegates/actions/domainActions';

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
  directCallEventActions,
  browserConditionActions,
  cartAmountConditionActions,
  cookieConditionActions,
  cookieOptOutConditionActions,
  customConditionActions,
  deviceTypeConditionActions,
  domainConditionActions,
  cookieDataElementActions,
  customDataElementActions,
  domDataElementActions,
  queryParamDataElementActions,
  variableDataElementActions
);
