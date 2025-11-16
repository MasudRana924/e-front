// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.api";
import transactionReducer from "./features/transactions/transactions.api";
import dashboardReducer from "./features/dashboard/dashboard.api";
import userReducer from "./features/user/user.api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
