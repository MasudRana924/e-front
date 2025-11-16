import { DashboardLayout } from "./modules/dashboard/dashboard-layout";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

