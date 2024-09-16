import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  username?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  gender?: string;
}

interface UserState {
  userData: UserData;
}

const initialState: UserState = {
  userData: {}
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
      state.userData ={};
      localStorage.removeItem('userData');
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;


