import isFunction from "lodash/isFunction";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";

/** Использовать состояние, которое сбрасывается к начальному значению при изменении зависимостей */
export const useDependentState = <S>(
  initialState: S | (() => S),
  deps: DependencyList
): [S, Dispatch<SetStateAction<S>>] => {
  const forceUpdate = useForceUpdate();

  const defaultState = useMemo(
    () => (isFunction(initialState) ? initialState() : initialState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const stateRef = useRef<S>(defaultState);
  const isDepsChange = useDepsChange(deps);

  if (isDepsChange) {
    stateRef.current = defaultState;
  }

  const setState = useCallback((value: S | ((prev: S) => S)) => {
    stateRef.current = isFunction(value) ? value(stateRef.current) : value;
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [stateRef.current, setState];
};

const useForceUpdate = () => useReducer((n: number) => n + 1, 0)[1];

const useDepsChange = (deps: DependencyList): boolean => {
  const prevDepsRef = useRef(deps);
  const isFirstRenderRef = useRef(true);

  const hasChanged =
    !isFirstRenderRef.current &&
    (!prevDepsRef.current ||
      deps.length !== prevDepsRef.current.length ||
      deps.some((dep, i) => !Object.is(dep, prevDepsRef.current![i])));

  prevDepsRef.current = deps;
  isFirstRenderRef.current = false;

  return hasChanged;
};
