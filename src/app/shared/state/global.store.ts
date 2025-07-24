import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type GlobalState = {
  isLoading: boolean;
};

const initialState: GlobalState = {
  isLoading: false,
};

export const GlobalStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setLoading(isLoading: boolean) {
      patchState(store, () => ({ isLoading }));
    },
  }))
);

export type GlobalStore = InstanceType<typeof GlobalStore>;
