import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import { useState } from "react";
import { UserDetail } from "@/src/types/vastuTypes";
import CanvasToolbar from "@/src/components/CanvasToolBar";


const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-1">
    <span className="text-sm font-semibold text-black whitespace-nowrap">
      {label} :
    </span>
    <span className="text-sm font-normal text-black/90">{value}</span>
  </div>
);

const EnergyVastuAnalyse = () => {
  const [userDetails] = useState<UserDetail>({
    name: "John Doe",
    phone: "1234567890",
    category: "Residential",
    dateOfPurchase: "01-01-2023",
    address: "123 Main St, Anytown, USA",
  });

  const details = [
    { label: "Full Name", value: userDetails.name },
    { label: "Mobile No.", value: userDetails.phone },
    { label: "Category", value: userDetails.category },
    { label: "Date of Purchase", value: userDetails.dateOfPurchase },
    { label: "Address", value: userDetails.address},
  ];

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav
        items={[
          { label: "Vastu Analysis", href: "/energy-vastu" },
          { label: "Energy Vastu Analyse" },
        ]}
      />

      <CustomAnalysisComponent
        title="Vastu Energy Analysis"
        reportListHref="/list/energy-vastu"
      >
        <div className="grid grid-cols-4 gap-x-3 gap-y-2">
          {details.map((item) => (
            <Field key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </CustomAnalysisComponent>

      <article className="w-full h-full rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
        <CanvasToolbar />
      </article>
    </section>
  );
};

export default EnergyVastuAnalyse;