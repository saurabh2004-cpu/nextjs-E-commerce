import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import wishlistSlice from './wishlistSlice';
import orderSlice from './orderSlice';

const store = configureStore({
  reducer: {
    user:userSlice,
    order:orderSlice,
    
  }
});



export default store;
