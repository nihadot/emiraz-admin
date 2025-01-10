import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  data: [];
}

const initialState: AuthState = {
  data:[],
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    fetchBlogsAction(state, action: PayloadAction<string>) {
      state.data = action.payload;
    },
  },
});

export const { fetchBlogsAction } = blogSlice.actions;

export default blogSlice.reducer;
