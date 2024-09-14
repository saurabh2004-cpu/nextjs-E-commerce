import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.userData = null;
      localStorage.removeItem('userData');
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;


