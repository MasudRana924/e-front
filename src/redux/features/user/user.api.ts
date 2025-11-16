import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../baseApi";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "../../store";
import type { IResponse, TRole } from "../../../types";

interface User {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  nid: string;
  role: TRole;
  status?: string;
  auths?: Array<{
    provider: string;
    providerId: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get<IResponse<User>>("/users/me", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (err: unknown) {
      console.error("Get Profile API Error:", err);

      let errorMessage = "Failed to get user profile";

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk<User, { name?: string; email?: string; profile?: string }, { rejectValue: string }>(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.put<IResponse<User>>("/users/me", profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (err: unknown) {
      console.error("Update Profile API Error:", err);

      let errorMessage = "Failed to update profile";

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user with fresh data from API
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user with fresh data from API
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;

// Hook to access user state
export const useUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const getUserProfileData = useCallback(() => {
    return dispatch(getUserProfile());
  }, [dispatch]);

  const updateProfile = useCallback((profileData: { name?: string; email?: string; profile?: string }) => {
    return dispatch(updateUserProfile(profileData));
  }, [dispatch]);

  const clearUserData = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  return {
    ...user,
    getUserProfile: getUserProfileData,
    updateProfile,
    clearUser: clearUserData
  };
};
