import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import helperReducer from './helperSlice';
import messagesReducer from './messagesSlice';
// Load state from localStorage
const loadState = () => {
  try {
    if (typeof window === 'undefined') return undefined;
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    if (typeof window === 'undefined') return;
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    helpers: helperReducer,
    messages: messagesReducer,
  },
  preloadedState,
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;