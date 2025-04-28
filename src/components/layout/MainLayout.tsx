
import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full dark:bg-background">
          <Navbar />
          <div className="flex-grow flex">
            {children}
          </div>
          <Footer />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
