import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
