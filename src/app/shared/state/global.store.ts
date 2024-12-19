import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../../services';

type GlobalState = {
  user: User | null;
  authorized: boolean;
};

const initialState: GlobalState = {
  user: null,
  authorized: false,
};

export const GlobalStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    login(user: User | null, authorized: boolean) {
      patchState(store, () => ({ user, authorized }));
    },
    logout(user: User | null, authorized: boolean) {
      patchState(store, () => ({ user, authorized }));
    },
  }))
);

export type GlobalStore = InstanceType<typeof GlobalStore>;
