import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import "./globals.css";
import ModalProvider from "@/providers/ModalProvider";

const inter = Roboto_Flex({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "GenieworksAI",
  description: "GenieworksAI AI Platform",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
