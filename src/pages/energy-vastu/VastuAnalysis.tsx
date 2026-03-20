import React from "react";
import CustomInput from "../../components/CustomInput";
import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";

const VastuAnalysis: React.FC = () => {
  const handleReset = () => {
    console.log("Reset clicked");
  };

  const handleSubmit = () => {
    console.log("Submit clicked");
  };

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav items={[{ label: "Vastu Analysis" }]} />
      <CustomAnalysisComponent
        title="Vastu Energy Analysis"
        reportListHref="/vastu/reports"
        footerButtons={[
          { label: "Reset", onClick: handleReset, variant: "outline" },
          { label: "Save & Submit", onClick: handleSubmit, variant: "primary" },
        ]}
      >
        <form>
          <CustomInput />
          
        </form>
      </CustomAnalysisComponent>
    </section>
  );
};

export default VastuAnalysis;
