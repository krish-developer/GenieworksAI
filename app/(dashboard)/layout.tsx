import React, { ReactNode } from "react";

import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
import { checkSubscription, fetchUser } from "@/lib/actions";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const userDetails = await fetchUser();
  const isPro = await checkSubscription();

  return (
    <div className="h-screen flex flex-row overflow-hidden">
      <section className="max-md:hidden">
        <Sidebar apiLimitCount={userDetails?.limit} isPro={isPro} />
      </section>

      <main className="py-5 w-full overflow-auto">
        <Topbar apiLimitCount={userDetails?.limit} isPro={isPro} />
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
