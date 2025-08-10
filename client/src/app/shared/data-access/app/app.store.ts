import { signalStore, withState } from '@ngrx/signals';
import { withAppReducer } from './app.reducer';

export type AppState = {
  isLoading: boolean;
};

const initialState: AppState = {
  isLoading: true,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withAppReducer(),
);
