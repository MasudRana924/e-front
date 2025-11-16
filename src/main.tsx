import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { RouterProvider } from "react-router";
import { router } from './routes/index.tsx'
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store.ts';
import { ToastProvider } from './components/ui/toast';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
)
