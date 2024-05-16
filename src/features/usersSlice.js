import {createSlice} from "@reduxjs/toolkit";
import {signIn, signUp} from "./userThunk";

const initialState = {
  user: null,
  signInLoading: false,
  signUpLoading: false,
};

const UsersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.user = '';
      state.signUpLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, {payload: res}) => {
      state.user = res.user;
      state.signUpLoading = false;
    });
    builder.addCase(signUp.rejected, (state, {payload: error}) => {
      state.signUpLoading = false;
    });

    builder.addCase(signIn.pending, (state) => {
      state.user = '';
      state.signInLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, {payload: res}) => {
      state.user = res.user;
      state.signInLoading = false;
    });
    builder.addCase(signIn.rejected, (state, {payload: error}) => {
      state.signInLoading = false;
    });
  },
});

export const userReducer = UsersSlice.reducer;
export const {logout} = UsersSlice.actions;
