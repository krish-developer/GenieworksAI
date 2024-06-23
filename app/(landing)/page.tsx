import React from "react";

import LandingNavbar from "@/components/shared/LandingNavbar";
import LandingHero from "@/components/shared/LandingHero";
import LandingContent from "@/components/shared/LandingContent";

const LangingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
};

export default LangingPage;
