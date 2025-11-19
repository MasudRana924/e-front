import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../baseApi";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "../../store";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  agentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  nid: string;
  role: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface AgentsListResponse {
  data: Agent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    } | string;
    headers?: Record<string, string>;
  };
  message?: string;
}

interface AdminState {
  users: User[];
  agents: Agent[];
  usersMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  agentsMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  usersLoading: boolean;
  agentsLoading: boolean;
  approveLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  agents: [],
  usersMeta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  agentsMeta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  usersLoading: false,
  agentsLoading: false,
  approveLoading: false,
  error: null,
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get<UsersListResponse>("/admin/users", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Fetch Users API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      let errorMessage = "Failed to fetch users";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching agents
export const fetchAgents = createAsyncThunk(
  "admin/fetchAgents",
  async (params: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiParams: { page: number; limit: number; status?: string } = {
        page: params.page || 1,
        limit: params.limit || 10,
      };
      
      // Only add status param if it's explicitly provided
      if (params.status) {
        apiParams.status = params.status;
      }

      const response = await api.get<AgentsListResponse>("/admin/agents", {
        params: apiParams,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Fetch Agents API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      let errorMessage = "Failed to fetch agents";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for approving user
export const approveUser = createAsyncThunk(
  "admin/approveUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.patch(`/admin/users/${userId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return { userId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Approve User API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      let errorMessage = "Failed to approve user";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for approving agent
export const approveAgent = createAsyncThunk(
  "admin/approveAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.patch(`/admin/agents/${agentId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return { agentId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Approve Agent API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      let errorMessage = "Failed to approve agent";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersMeta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAgents.pending, (state) => {
        state.agentsLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agentsLoading = false;
        state.agents = action.payload.data;
        state.agentsMeta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.agentsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(approveUser.pending, (state) => {
        state.approveLoading = true;
        state.error = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.approveLoading = false;
        // Update user status in the list
        const userIndex = state.users.findIndex(u => u._id === action.payload.userId);
        if (userIndex !== -1) {
          state.users[userIndex].agentStatus = 'approved';
        }
        state.error = null;
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload as string;
      })
      .addCase(approveAgent.pending, (state) => {
        state.approveLoading = true;
        state.error = null;
      })
      .addCase(approveAgent.fulfilled, (state, action) => {
        state.approveLoading = false;
        // Update user status in the list (agents are now part of users list)
        const userIndex = state.users.findIndex(u => u._id === action.payload.agentId);
        if (userIndex !== -1) {
          state.users[userIndex].agentStatus = 'approved';
        }
        // Also update in agents list if exists (for backward compatibility)
        const agentIndex = state.agents.findIndex(a => a._id === action.payload.agentId);
        if (agentIndex !== -1) {
          state.agents[agentIndex].status = 'approved';
        }
        state.error = null;
      })
      .addCase(approveAgent.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;

// Hook to access admin state
export const useAdmin = () => {
  const admin = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchUsers = useCallback((params: { page?: number; limit?: number }) => {
    return dispatch(fetchUsers(params));
  }, [dispatch]);

  const handleFetchAgents = useCallback((params: { page?: number; limit?: number; status?: string }) => {
    return dispatch(fetchAgents(params));
  }, [dispatch]);

  const handleApproveUser = useCallback((userId: string) => {
    return dispatch(approveUser(userId));
  }, [dispatch]);

  const handleApproveAgent = useCallback((agentId: string) => {
    return dispatch(approveAgent(agentId));
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...admin,
    fetchUsers: handleFetchUsers,
    fetchAgents: handleFetchAgents,
    approveUser: handleApproveUser,
    approveAgent: handleApproveAgent,
    clearError: handleClearError,
  };
};

