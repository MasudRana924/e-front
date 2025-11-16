import type { ReactNode } from "react";
import { Footer } from "../footer";
import { Navigation } from "../navigation";
import { Toaster } from "../ui/sonner";

interface IProps {
  children: ReactNode;
}

export default function AppLayout({ children }: IProps) {
  return (
    <div className=" min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}