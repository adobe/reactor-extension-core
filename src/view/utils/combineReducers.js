export default (...reducers) => (model, ...rest) => {
  return reducers.reduce((previousModel, reducer) => {
    var reducerArgs = rest.slice();
    reducerArgs.unshift(previousModel);
    return reducer.apply(null, reducerArgs);
  }, model);
};
