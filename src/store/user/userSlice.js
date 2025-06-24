import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, authenticateUser, fetchAllUsers } from "../../service/userService";

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await authenticateUser(userData.email, userData.password);
      localStorage.setItem("token", result.token);
      localStorage.setItem("useremail", result.email);
      localStorage.setItem("userId", result.id);
      localStorage.setItem("role", result.role);
      return result;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const addUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Fetch all users to check for duplicate email
      const allUsersResponse = await fetchAllUsers();
      const allUsers = allUsersResponse.data;
      if (allUsers.some(u => u.email === userData.email)) {
        return rejectWithValue({ message: "Email already exists" });
      }
      const response = await createUser(userData);
      localStorage.setItem("role", response.data.role);
      return {
        message: "Registration successful",
        user: response.data
      };
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || error.message });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: [],
    loading: false,
    error: null,
    role: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("useremail");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.users)) state.users = [];
        state.users.push(action.payload.user);
        if (action.payload && action.payload.user) {
          state.role = action.payload.user.role;
        }
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
