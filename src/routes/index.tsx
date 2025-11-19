import App from "../App";
import About from "../pages/About";

import { createBrowserRouter } from "react-router-dom";
import FAQPage from "../pages/FAQ";
import ContactPage from "../pages/Contact";
import FeaturesPage from "../pages/Features";
import PricingPage from "../pages/Pricing";
import Home from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { SignupPage } from "../pages/Registration";
import Dashboard from "../pages/Dashboard";
import MyWallet from "../pages/MyWallet";
import SendMoney from "../pages/SendMoney";
import Deposit from "../pages/Deposit";
import WithdrawMoney from "../pages/WithdrawMoney";
import CashOut from "../pages/CashOut";
import CashIn from "../pages/CashIn";
import Transactions from "../pages/Transactions";
import Profile from "../pages/Profile";
import AdminAddMoney from "../pages/AdminAddMoney";
import AdminTransferToAgent from "../pages/AdminTransferToAgent";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DashboardWrapper } from "../components/DashboardWrapper";
import { RedirectIfAuthenticated } from "../components/RedirectIfAuthenticated";



export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
        {
            Component: Home,
            path: "/",
          },
      {
        Component: About,
        path: "about",
      },
      {
        Component: FAQPage,
        path: "faq",
      },
      {
        Component: ContactPage,
        path: "contact",
      },
      {
        Component: FeaturesPage,
        path: "features",
      },
      {
        Component: PricingPage,
        path: "pricing",
      },
      {
        path: "login",
        element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: "signup",
        element: (
          <RedirectIfAuthenticated>
            <SignupPage />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <Dashboard />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/wallet",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <MyWallet />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/send",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <SendMoney />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/deposit",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <Deposit />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/add-money",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <Deposit />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/withdraw",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <WithdrawMoney />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/cash-out",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <CashOut />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/cash-in",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <CashIn />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/transactions",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <Transactions />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/profile",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <Profile />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin/add-money",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <AdminAddMoney />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin/transfer-to-agent",
        element: (
          <ProtectedRoute>
            <DashboardWrapper>
              <AdminTransferToAgent />
            </DashboardWrapper>
          </ProtectedRoute>
        ),
      },
    
    ],
    
  },
 

]);