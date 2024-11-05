import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './ticketsSlices';

const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
  },
});

export default store;
