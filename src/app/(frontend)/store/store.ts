import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import orderSlice from './orderSlice';

const store = configureStore({
  reducer: {
    user:userSlice,
    order:orderSlice,
    
  }
});

export type RootState = ReturnType<typeof store.getState>;


export default store;
