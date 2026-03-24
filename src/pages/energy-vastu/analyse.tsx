import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import { useCallback, useRef, useState } from "react";
import { CanvasAreaHandle, UserDetail } from "@/src/types/vastuTypes";
import CanvasToolbar from "@/src/components/CanvasToolBar";
import CanvasArea, { Pin } from "@/src/components/CanvasAreas";
import mapBg from "@/src/assets/map.jpg";


const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex gap-1">
    <span className="text-sm font-semibold text-black whitespace-nowrap">
      {label} :
    </span>
    <span className="text-sm font-normal text-black/90">{value ?? ""}</span>
  </div>
);

const EnergyVastuAnalyse = () => {
  const [tool, setTool]       = useState<"move" | "pin" | "tool">("move");
  const [division, setDiv]    = useState(8);
  const [degree, setDegree]   = useState(0);
  const [gateOptions, setGateOptions] = useState<string[]>([]);
  const canvasRef             = useRef<CanvasAreaHandle>(null);

  const [userDetails] = useState<UserDetail>({
    name: "John Doe",
    phone: "1234567890",
    category: "Residential",
    dateOfPurchase: "01-01-2023",
    address: "123 Main St, Anytown, USA",
    map: mapBg,
  });

  const details = [
    { label: "Full Name", value: userDetails.name },
    { label: "Mobile No.", value: userDetails.phone },
    { label: "Category", value: userDetails.category },
    { label: "Date of Purchase", value: userDetails.dateOfPurchase },
    { label: "Address", value: userDetails.address},
  ];

  const handlePinsChange = useCallback((pins: Pin[]) => {
    if (pins.length < 2) {
      setGateOptions([]);
      return;
    }
    const options: string[] = [];
    for (let i = 0; i < pins.length; i++) {
      const to = (i + 1) % pins.length;
      options.push(`A${i}-A${to}`);
    }
    setGateOptions(options);
  }, []);

   const handleGateChange = useCallback((value: string) => {
    if (!value) return;
    // value format: "A{from}-A{to}"
    const match = value.match(/^A(\d+)-A(\d+)$/);
    if (!match) return;
    const fromIdx = parseInt(match[1], 10);
    const toIdx   = parseInt(match[2], 10);
    canvasRef.current?.rotateCompassToGate(fromIdx, toIdx);
  }, []);

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

      <article className="w-full h-full mt-4 rounded-xl p-4 bg-white/50 border-4 border-lightYellow backdrop-blur-lg font-medium">
        <CanvasToolbar
        onMove={() => setTool("move")}
        onPin={() => setTool("pin")}
        onTool={() => setTool("tool")}
        onDivisionChange={setDiv}
        onDegreeChange={setDegree}
        onUndo={() => canvasRef.current?.undo()}
        onDelete={() => canvasRef.current?.deleteAll()}
        onRotateLeft={() => canvasRef.current?.rotateLeft()}
        onRotateRight={() => canvasRef.current?.rotateRight()}
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onMaximize={() => canvasRef.current?.fitToScreen()}
        gateOptions={gateOptions}
        onGateChange={handleGateChange}
        />

         <div className="mt-4">
        <CanvasArea
          ref={canvasRef}
          mapUrl={mapBg} 
          tool={tool}
          division={division}
          degree={degree}
          onPinsChange={handlePinsChange}
        />
      </div>

      </article>
    </section>
  );
};

export default EnergyVastuAnalyse;