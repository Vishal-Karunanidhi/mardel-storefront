import { useRouter } from 'next/router';
import { useReducer, createContext, useContext } from 'react';

const initialState = {};
const ReduxContext = createContext(initialState);

const applyMiddleware =
  (...funcs) =>
  (_state, _action) =>
    funcs.forEach((func) => func(_state, _action));

const Provider = ({ children, reducers, applyMiddleware, ...rest }) => {
  const { asPath } = useRouter();
  const defaultState = reducers(undefined, initialState);
  if (defaultState === undefined) {
    throw new Error("reducer's should not return undefined");
  }
  const [state, dispatch] = useReducer((_state, _action) => {
    // Logic of middleware needs to update
    applyMiddleware(_state, _action);
    return reducers(_state, _action);
  }, defaultState);

  const { currentPath, isPageTypeUpdated } = state?.layout?.pageType;
  const { isExistingSession } = state?.auth?.heartBeatInfo;
  const isNoPageTransition = asPath === currentPath;

  if (state?.auth?.heartBeatInfo) {
    state.auth.heartBeatInfo['isExistingSession'] = isExistingSession && isNoPageTransition;
  }
  if (state?.layout?.pageType) {
    state.layout.pageType['isPageTypeUpdated'] = isPageTypeUpdated && isNoPageTransition;
  }

  return <ReduxContext.Provider value={{ state, dispatch }}>{children}</ReduxContext.Provider>;
};

const combineReducers = (reducers) => {
  const entries = Object.entries(reducers);
  return (state = {}, action) => {
    return entries.reduce((_state, [key, reducer]: any) => {
      _state[key] = reducer(state[key], action);
      return _state;
    }, {});
  };
};

const connect = (mapStateToProps, mapDispatchToProps) => {
  return (WrappedComponent) => {
    return (props) => {
      const { state, dispatch }: any = useContext(ReduxContext);
      let localState = { ...state };
      if (mapStateToProps) {
        localState = mapStateToProps(state);
      }
      if (mapDispatchToProps) {
        localState = { ...localState, ...mapDispatchToProps(dispatch, state) };
      }
      return <WrappedComponent {...props} {...localState} state={state} dispatch={dispatch} />;
    };
  };
};

// Use Selector alternative for connect function
const useSelector = (callback) => {
  const state = { ...useContext(ReduxContext)['state'] };
  return callback ? callback(state) : state;
};

// This hook returns a reference to the dispatch function from the context.
const useDispatch = () => useContext(ReduxContext)['dispatch'];

export default Provider;
export { ReduxContext, applyMiddleware, connect, useSelector, useDispatch, combineReducers };
