export default reducer => state => {
  let reducerName = reducer.name || 'unnamed';
  let actionLabel = `Action: ${reducerName}`;
  console.group(actionLabel);
  console.log('State before:', state.toJS());
  let newState = reducer(state);
  console.log('State after:', newState.toJS());
  console.groupEnd(actionLabel);
  return newState;
};
