import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'), // Retrieve token from localStorage
  isLoggedIn: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAuthAction(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    logoutAuthAction(state) {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token'); // Clear token from localStorage
    },
  },
});

export const { loginAuthAction, logoutAuthAction } = authSlice.actions;

export default authSlice.reducer;
